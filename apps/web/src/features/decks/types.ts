import type { Card } from '@/features/cards/types'
import type { SourceDocument } from '@/features/documents/types'

export type Deck = {
  id: string
  documentId: string
  title: string
  description: string | null
  topics: string | null
  cardCount: number
  createdAt: string
  updatedAt: string
}

export type DeckSummary = Deck & {
  document: SourceDocument
  cardTotal: number
}

export type DeckProgress = {
  step: 'finding' | 'writing'
  status: 'waiting' | 'running' | 'done' | 'failed'
  error: string | null
}

export type DeckDetail = Deck & {
  document: SourceDocument
  progress: DeckProgress | null
  cards: Card[]
}

/** Null while loading, so a count is never shown as 0 by mistake. */
export type LibraryCounts = {
  decks: number | null
  cards: number | null
  documents: number | null
}
