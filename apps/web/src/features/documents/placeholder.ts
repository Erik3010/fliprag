import type { SourceDocument } from '@/features/documents/types'

// Stand-in rows so the screens can be built before the API exists. Nothing here is real.
// Delete this file once documents are loaded from the server.

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

export const placeholderDocuments: SourceDocument[] = [
  {
    id: '1',
    name: 'Bio-201 Lecture 4.pdf',
    pageCount: 38,
    sizeBytes: 2_411_000,
    addedAt: daysAgo(1),
  },
  {
    id: '2',
    name: 'Campbell Ch.7 excerpt.pdf',
    pageCount: 24,
    sizeBytes: 1_180_000,
    addedAt: daysAgo(6),
  },
  {
    id: '3',
    name: 'Bio-201 Lecture 2.pdf',
    pageCount: 31,
    sizeBytes: 1_905_000,
    addedAt: daysAgo(12),
  },
]
