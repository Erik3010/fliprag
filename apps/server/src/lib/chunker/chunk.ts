import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { isSkippedSection } from './cleanup.js'
import { type Block, type Section, toSections } from './structure.js'

export type Page = {
  number: number
  markdown: string
}

export type Chunk = {
  text: string
  headingPath: string | null
  firstPage: number
  lastPage: number
}

// In characters. Measured against a plain splitter in part 3, and kept.
const MAX = 2000
const OVERLAP = 200
const MIN = 300

type Draft = {
  text: string
  path: string[]
  pages: number[]
}

const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
  chunkSize: MAX,
  chunkOverlap: OVERLAP,
})

export async function chunkPages(pages: Page[]): Promise<Chunk[]> {
  const sections = toSections(pages).filter((section) => !isSkippedSection(section))
  const drafts = (await Promise.all(sections.map(splitSection))).flat()
  return mergeShort(drafts).map(toChunk)
}

// Tables are never split: a table over the limit skips the splitter and becomes its own chunk.
async function splitSection(section: Section) {
  const drafts: Draft[] = []
  let pending: Block[] = []

  for (const block of section.blocks) {
    if (block.kind === 'table' && block.text.length > MAX) {
      drafts.push(...(await splitBlocks(pending, section.path)))
      drafts.push({ text: block.text, path: section.path, pages: [block.page] })
      pending = []
      continue
    }
    pending.push(block)
  }

  drafts.push(...(await splitBlocks(pending, section.path)))
  return drafts
}

async function splitBlocks(blocks: Block[], path: string[]) {
  let text = ''
  const spans = blocks.map((block) => {
    text += text ? '\n\n' : ''
    const start = text.length
    text += block.text
    return { page: block.page, start, end: text.length }
  })

  // The splitter returns plain text, so find each piece in the text to work out its pages.
  const drafts: Draft[] = []
  let from = 0
  for (const piece of text ? await splitter.splitText(text) : []) {
    const found = text.indexOf(piece, from)
    const start = found === -1 ? from : found
    const end = start + piece.length
    const covered = spans.filter((span) => span.start < end && span.end > start)
    drafts.push({
      text: piece,
      path,
      pages: (covered.length > 0 ? covered : spans).map((span) => span.page),
    })
    from = start + 1
  }
  return drafts
}

function mergeShort(drafts: Draft[]) {
  const merged: Draft[] = []
  let carried: Draft | undefined

  for (const draft of drafts) {
    const next = carried ? join(carried, draft) : draft
    carried = undefined
    if (next.text.length < MIN) {
      carried = next
      continue
    }
    merged.push(next)
  }

  if (carried) {
    const last = merged.pop()
    merged.push(last ? join(last, carried) : carried)
  }
  return merged
}

// Keeps only the headings both paths share: "A > B" + "A > C" → "A".
function join(first: Draft, second: Draft): Draft {
  const shared = first.path.findIndex((title, index) => second.path[index] !== title)
  return {
    text: `${first.text}\n\n${second.text}`,
    path: shared === -1 ? first.path : first.path.slice(0, shared),
    pages: [...first.pages, ...second.pages],
  }
}

function toChunk(draft: Draft): Chunk {
  return {
    text: draft.text,
    headingPath: draft.path.length > 0 ? draft.path.join(' > ') : null,
    firstPage: Math.min(...draft.pages),
    lastPage: Math.max(...draft.pages),
  }
}
