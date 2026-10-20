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

// EventSource cannot send the Authorization header, so the stream is read through ky.
export async function followDeck(
  id: string,
  signal: AbortSignal,
  onDeck: (deck: DeckDetail) => void,
) {
  const response = await api.get(`decks/${id}/events`, { timeout: false, signal })
  if (!response.body) return

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let pending = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) return
    pending += value
    const events = pending.split('\n\n')
    pending = events.pop() ?? ''
    for (const event of events) {
      const data = event
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n')
      if (data) {
        onDeck(JSON.parse(data) as DeckDetail)
      }
    }
  }
}

export function updateDeck(id: string, body: UpdateDeck) {
  return api.patch(`decks/${id}`, { json: body }).json<DeckDetail>()
}

export function deleteDeck(id: string) {
  return api.delete(`decks/${id}`)
}
