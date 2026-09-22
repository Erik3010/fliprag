export type Deck = {
  id: string
  title: string
  cardCount: number
  documentName: string
  updatedAt: string
}

export type LibraryCounts = {
  decks: number
  cards: number
  documents: number
}
