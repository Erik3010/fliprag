import type { NewDeck, UpdateDeck } from '@fliprag/schemas/deck'
import type { Deck, DeckDetail, DeckSummary } from '@/features/decks/types'
import { api } from '@/lib/http'

export function listDecks() {
  return api.get('decks').json<DeckSummary[]>()
}

export function getDeck(id: string) {
  return api.get(`decks/${id}`).json<DeckDetail>()
}

export function createDeck(body: NewDeck) {
  return api.post('decks', { json: body }).json<Deck>()
}

export function updateDeck(id: string, body: UpdateDeck) {
  return api.patch(`decks/${id}`, { json: body }).json<DeckDetail>()
}

export function deleteDeck(id: string) {
  return api.delete(`decks/${id}`)
}
