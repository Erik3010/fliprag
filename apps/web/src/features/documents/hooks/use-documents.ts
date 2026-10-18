import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '@/features/documents/api'
import { failureMessage } from '@/lib/http'

export const documentsQueryKey = ['documents'] as const

export function useDocuments() {
  const query = useQuery({ queryKey: documentsQueryKey, queryFn: listDocuments })

  return {
    documents: query.data,
    loading: query.isPending,
    error: query.error ? failureMessage(query.error) : undefined,
    retry: () => query.refetch(),
  }
}
