import type { Card } from '@/features/cards/types'

export type CardsAction =
  | { type: 'add'; id: string }
  | { type: 'update'; id: string; patch: Partial<Pick<Card, 'front' | 'back'>> }
  | { type: 'move'; id: string; direction: -1 | 1 }
  | { type: 'remove'; id: string }
  | { type: 'restore'; card: Card; index: number }

// The card list of one deck, in order. Pure, so the same moves can run against the API later.
export function cardsReducer(cards: Card[], action: CardsAction): Card[] {
  switch (action.type) {
    case 'add':
      return [...cards, { id: action.id, front: '', back: '' }]

    case 'update':
      return cards.map((card) => (card.id === action.id ? { ...card, ...action.patch } : card))

    case 'move': {
      const from = cards.findIndex((card) => card.id === action.id)
      const to = from + action.direction
      if (from < 0 || to < 0 || to >= cards.length) {
        return cards
      }
      const next = cards.slice()
      next[from] = cards[to] as Card
      next[to] = cards[from] as Card
      return next
    }

    case 'remove':
      return cards.filter((card) => card.id !== action.id)

    case 'restore': {
      const next = cards.slice()
      next.splice(Math.min(action.index, next.length), 0, action.card)
      return next
    }
  }
}
