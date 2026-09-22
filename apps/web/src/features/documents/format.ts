import type { SourceDocument } from '@/features/documents/types'
import { relativeDay } from '@/shared/relative-time'

export function documentMeta(document: SourceDocument) {
  const pages = `${document.pageCount} page${document.pageCount === 1 ? '' : 's'}`

  return `${pages} · Added ${relativeDay(document.addedAt)}`
}
