import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '@/features/documents/api'
import { failureMessage } from '@/lib/http'

export const documentsQueryKey = ['documents'] as const

const PROCESSING_POLL_MS = 3000

export function useDocuments() {
  const query = useQuery({
    queryKey: documentsQueryKey,
    queryFn: listDocuments,
    refetchInterval: (current) =>
      current.state.data?.some((document) => document.status === 'processing')
        ? PROCESSING_POLL_MS
        : false,
  })

  return {
    documents: query.data,
    loading: query.isPending,
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}
