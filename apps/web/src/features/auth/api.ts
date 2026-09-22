import type { Credentials } from '@fliprag/schemas/auth'
import { api } from '@/lib/http'
import type { AuthUser } from '@/store/auth'

type Session = { token: string; user: AuthUser }

export function login(credentials: Credentials) {
  return api.post('auth/login', { json: credentials }).json<Session>()
}

export function signup(credentials: Credentials) {
  return api.post('auth/signup', { json: credentials }).json<Session>()
}

export function me() {
  return api.get('auth/me').json<AuthUser>()
}
