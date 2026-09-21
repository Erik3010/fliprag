import { useQuery } from '@tanstack/react-query'
import { fetchHealth, type Health } from '@/features/health/api'
import { failureMessage } from '@/shared/api'

export type Probe =
  | { state: 'checking' }
  | { state: 'reachable'; health: Health }
  | { state: 'unreachable'; detail: string }

export function useServerHealth() {
  const query = useQuery({
    queryKey: ['server-health'],
    retry: false,
    queryFn: async () => {
      try {
        return await fetchHealth()
      } catch (error) {
        throw new Error(failureMessage(error))
      }
    },
  })

  const probe: Probe = query.isFetching
    ? { state: 'checking' }
    : query.error
      ? { state: 'unreachable', detail: query.error.message }
      : query.data
        ? { state: 'reachable', health: query.data }
        : { state: 'checking' }

  return { probe, check: () => query.refetch() }
}
