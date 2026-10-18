import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { getDeck } from '@/features/decks/api'
import { decksQueryKey } from '@/features/decks/hooks/use-decks'
import { failureMessage } from '@/lib/http'

export function deckQueryKey(id: string) {
  return [...decksQueryKey, id] as const
}

function isNotFound(error: unknown) {
  return error instanceof HTTPError && error.response.status === 404
}

export function useDeck(id: string) {
  const query = useQuery({
    queryKey: deckQueryKey(id),
    queryFn: () => getDeck(id),
    // A deck that is not there will not appear on a second try.
    retry: (count, error) => !isNotFound(error) && count < 3,
  })

  return {
    deck: query.data,
    loading: query.isPending,
    notFound: isNotFound(query.error),
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}
