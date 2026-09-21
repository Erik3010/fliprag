import { api } from '@/shared/api'

export type Health = {
  status: string
  uptime: number
}

export function fetchHealth() {
  return api.get('health', { retry: 0 }).json<Health>()
}
