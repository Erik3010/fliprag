import ky, { HTTPError } from 'ky'
import { useAuthStore } from '@/store/auth'

export const api = ky.create({
  prefix: '/api/',
  retry: { limit: 2 },
  timeout: 10_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const { token } = useAuthStore.getState()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      // A 401 on a request that carried a token means the token is no longer good. A 401 on
      // login is a wrong password, which carries none.
      ({ request, response }) => {
        if (response.status === 401 && request.headers.has('Authorization')) {
          useAuthStore.getState().signOut()
        }
      },
    ],
  },
})

// Every server error is { message }, see apps/server/README.md.
type ErrorBody = { message?: string }

export function failureMessage(error: unknown): string {
  // ky consumes the response to populate `data`, so error.response.json() never works here.
  if (error instanceof HTTPError) {
    const body = typeof error.data === 'object' && error.data ? (error.data as ErrorBody) : null

    return body?.message ?? `The server answered ${error.response.status}.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'The request failed before it got a reply.'
}
