export type Deck = {
  id: string
  title: string
  cardCount: number
  documentName: string
  updatedAt: string
}

export type DeckStatus = 'generating' | 'ready'

export type DeckDetail = Deck & {
  description: string
  topics: string
  documentId: string
  status: DeckStatus
}

/** Null while loading, so a count is never shown as 0 by mistake. */
export type LibraryCounts = {
  decks: number | null
  cards: number | null
  documents: number | null
}
