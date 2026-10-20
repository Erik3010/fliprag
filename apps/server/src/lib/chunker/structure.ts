import type { Page } from './chunk.js'
import { isBoilerplateTitle, isNoiseLine, stripImages } from './cleanup.js'

export type Block = {
  kind: 'heading' | 'table' | 'text'
  text: string
  page: number
}

export type Section = {
  path: string[]
  blocks: Block[]
}

const HEADING = /^(#{1,6})\s+(.+)$/
const TABLE_ROW = /^\s*\|/
const SECTION_NUMBER = /^(\d+(?:\.\d+)*)\.?\s/

export function toSections(pages: Page[]) {
  const sections: Section[] = []
  const headings: { level: number; title: string }[] = []
  let current: Section = { path: [], blocks: [] }

  for (const block of toBlocks(pages)) {
    const match = block.kind === 'heading' ? block.text.match(HEADING) : null
    if (match?.[1] && match[2]) {
      if (current.blocks.length > 0) {
        sections.push(current)
      }
      const level = numberedLevel(match[2]) ?? match[1].length
      while ((headings.at(-1)?.level ?? 0) >= level) {
        headings.pop()
      }
      headings.push({ level, title: match[2].trim() })
      current = { path: headings.map((heading) => heading.title), blocks: [] }
    }
    current.blocks.push(block)
  }

  if (current.blocks.length > 0) {
    sections.push(current)
  }
  return sections
}

// OCR guesses heading levels from how text looks, and gets siblings wrong. A section number is the
// author's own: "3.2.2" is level 3, whatever its # count.
function numberedLevel(title: string) {
  return title.match(SECTION_NUMBER)?.[1]?.split('.').length
}

function toBlocks(pages: Page[]) {
  const blocks: Block[] = []
  let current: Block | null = null

  for (const page of pages) {
    current = null
    for (const raw of page.markdown.split('\n')) {
      let line = stripImages(raw).trimEnd()
      if (isNoiseLine(line)) {
        current = null
        continue
      }
      // OCR can leave a title like "References" as plain text. It becomes a heading, so its
      // section can be skipped.
      if (!HEADING.test(line) && isBoilerplateTitle(line)) {
        line = `# ${line.trim()}`
      }

      const kind = HEADING.test(line) ? 'heading' : TABLE_ROW.test(line) ? 'table' : 'text'
      if (current && current.kind === kind && kind !== 'heading') {
        current.text += `\n${line}`
        continue
      }
      current = { kind, text: line, page: page.number }
      blocks.push(current)
    }
  }
  return blocks
}
