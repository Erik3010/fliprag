import type { SourceDocument } from '@/features/documents/types'
import { relativeDay } from '@/shared/relative-time'

export function documentSize(bytes: number) {
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1000))} KB`
}

export function documentMeta(document: SourceDocument) {
  const pages = document.pageCount === null ? 'pages read on open' : `${document.pageCount} pages`

  return `${documentSize(document.sizeBytes)} · ${pages} · Added ${relativeDay(document.addedAt)}`
}
