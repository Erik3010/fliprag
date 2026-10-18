import { useQuery } from '@tanstack/react-query'
import { listDecks } from '@/features/decks/api'
import { failureMessage } from '@/lib/http'

export const decksQueryKey = ['decks'] as const

export function useDecks() {
  const query = useQuery({ queryKey: decksQueryKey, queryFn: listDecks })

  return {
    decks: query.data,
    loading: query.isPending,
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}
