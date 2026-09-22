import type { SourceDocument } from '@/features/documents/types'
import { relativeDay } from '@/lib/date'

export function documentSize(bytes: number) {
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1000))} KB`
}

export function documentMeta(document: SourceDocument) {
  return [
    document.sizeBytes === null ? null : documentSize(document.sizeBytes),
    document.pageCount === null ? 'page count unknown' : `${document.pageCount} pages`,
    `Added ${relativeDay(document.createdAt)}`,
  ]
    .filter(Boolean)
    .join(' · ')
}
