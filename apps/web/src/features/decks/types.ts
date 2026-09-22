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

export type LibraryCounts = {
  decks: number
  cards: number
  documents: number
}
