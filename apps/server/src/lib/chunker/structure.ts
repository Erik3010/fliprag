import type { Page } from './chunk.js'
import { isNoiseLine, stripImages } from './cleanup.js'

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
      const level = match[1].length
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

function toBlocks(pages: Page[]) {
  const blocks: Block[] = []
  let current: Block | null = null

  for (const page of pages) {
    current = null
    for (const raw of page.markdown.split('\n')) {
      const line = stripImages(raw).trimEnd()
      if (isNoiseLine(line)) {
        current = null
        continue
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
