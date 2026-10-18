import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { getDeck } from '@/features/decks/api'
import { decksQueryKey } from '@/features/decks/hooks/use-decks'
import { failureMessage } from '@/lib/http'

export function deckQueryKey(id: string) {
  return [...decksQueryKey, id] as const
}

export function useDeck(id: string) {
  const query = useQuery({ queryKey: deckQueryKey(id), queryFn: () => getDeck(id) })

  return {
    deck: query.data,
    loading: query.isPending,
    notFound: query.error instanceof HTTPError && query.error.response.status === 404,
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}
