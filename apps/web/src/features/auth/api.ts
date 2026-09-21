import type { Credentials } from '@fliprag/schemas/auth'
import { api } from '@/shared/api'

export function login(credentials: Credentials) {
  return api.post('auth/login', { json: credentials })
}

export function signup(credentials: Credentials) {
  return api.post('auth/signup', { json: credentials })
}
