import type { Section } from './structure.js'

const IMAGE = /!\[[^\]]*\]\([^)]*\)/g

const SKIPPED_SECTIONS = new Set([
  'contents',
  'table of contents',
  'references',
  'bibliography',
  'works cited',
  'list of figures',
  'list of tables',
  'daftar isi',
  'daftar pustaka',
  'daftar gambar',
  'daftar tabel',
  'daftar lampiran',
])

const NOISE_LINES = [
  /^\d{1,4}$/, // page number: 12
  /\.{4,}\s*\d+$/, // contents entry: Methods ........ 12
  /^([-*_])\1{2,}$/, // horizontal rule: ---
]

export function stripImages(line: string) {
  return line.replace(IMAGE, '')
}

export function isNoiseLine(line: string) {
  const text = line.trim()
  return !text || NOISE_LINES.some((noise) => noise.test(text))
}

// Drops only up to the next heading. OCR can mislabel "Contents" as # and the chapters as ##,
// so dropping what looks nested under it could drop every chapter.
export function isSkippedSection(section: Section) {
  const title = section.blocks[0]?.kind === 'heading' ? section.path.at(-1) : undefined
  return title !== undefined && SKIPPED_SECTIONS.has(normalizeTitle(title))
}

// "7 References", "**References**", "IV. References" → "references"
function normalizeTitle(title: string) {
  return title
    .replace(/[*_`]/g, '')
    .replace(/^([0-9]+(\.[0-9]+)*\.?|[ivxlc]+\.)\s+/i, '')
    .trim()
    .toLowerCase()
}
