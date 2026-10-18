import { api } from '@/lib/http'

export type Health = {
  status: string
  uptime: number
}

export function fetchHealth() {
  return api.get('health').json<Health>()
}
