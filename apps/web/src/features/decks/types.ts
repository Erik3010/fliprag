export type Deck = {
  id: string
  title: string
  cardCount: number
  documentName: string
  updatedAt: string
}

/** Whether the deck is still being made. Phase 1 walks the steps with a stand-in. */
export type DeckStatus = 'generating' | 'ready'

export type DeckDetail = Deck & {
  description: string
  topics: string
  documentId: string
  status: DeckStatus
}

/** Null while a count is still being fetched. A count is never drawn as zero on the way. */
export type LibraryCounts = {
  decks: number | null
  cards: number | null
  documents: number | null
}
