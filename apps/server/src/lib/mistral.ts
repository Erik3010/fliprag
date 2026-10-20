import { Mistral } from '@mistralai/mistralai'
import type { OCRPageObject } from '@mistralai/mistralai/models/components'
import type { Page } from './chunker/chunk.js'
import { requireEnv } from './env.js'

const { MISTRAL_API_KEY: apiKey, MISTRAL_OCR_MODEL: model } = requireEnv(
  'MISTRAL_API_KEY',
  'MISTRAL_OCR_MODEL',
)

const TIMEOUT_MS = 10 * 60 * 1000

const client = new Mistral({ apiKey, retryConfig: { strategy: 'none' }, timeoutMs: TIMEOUT_MS })

export async function ocrPdf(url: string, filename: string) {
  const result = await client.ocr.process({
    model,
    document: { type: 'document_url', documentUrl: url, documentName: filename },
    tableFormat: 'markdown',
    extractHeader: true,
    extractFooter: true,
    includeImageBase64: false,
  })

  return { model: result.model, pages: result.pages.map(toPage) }
}

// Mistral returns tables separately, leaving a [tbl-0.md](tbl-0.md) marker in the page text.
// Swap each marker back for its table, so the table stays next to the text around it.
function toPage(page: OCRPageObject): Page {
  const markdown = (page.tables ?? []).reduce(
    (text, table) => text.replaceAll(`[${table.id}](${table.id})`, table.content),
    page.markdown,
  )
  return { number: page.index + 1, markdown }
}
