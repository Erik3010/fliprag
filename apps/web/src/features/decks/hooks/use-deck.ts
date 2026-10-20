import { useQuery, useQueryClient } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { useEffect } from 'react'
import { followDeck, getDeck } from '@/features/decks/api'
import { generationOf } from '@/features/decks/generation'
import { decksQueryKey } from '@/features/decks/hooks/use-decks'
import type { DeckDetail } from '@/features/decks/types'
import { failureMessage } from '@/lib/http'

export function deckQueryKey(id: string) {
  return [...decksQueryKey, id] as const
}

export function useDeck(id: string) {
  const query = useQuery({ queryKey: deckQueryKey(id), queryFn: () => getDeck(id) })
  const making = query.data ? generationOf(query.data.progress).walking : false
  useFollowDeck(id, making)

  return {
    deck: query.data,
    loading: query.isPending,
    notFound: query.error instanceof HTTPError && query.error.response.status === 404,
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}

// Keeps the deck's query up to date from the server's events while the deck is being made.
function useFollowDeck(id: string, making: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!making) return
    const controller = new AbortController()

    const onDeck = (deck: DeckDetail) => {
      queryClient.setQueryData(deckQueryKey(id), deck)
      if (!deck.progress) {
        queryClient.invalidateQueries({ queryKey: decksQueryKey, exact: true })
      }
    }
    // A dropped stream falls back to one plain read, which shows wherever the deck has got.
    const onDropped = () => {
      if (!controller.signal.aborted) {
        queryClient.invalidateQueries({ queryKey: deckQueryKey(id), exact: true })
      }
    }

    followDeck(id, controller.signal, onDeck).catch(onDropped)
    return () => controller.abort()
  }, [id, making, queryClient])
}
