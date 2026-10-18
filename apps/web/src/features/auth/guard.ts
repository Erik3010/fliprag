import { redirect } from '@tanstack/react-router'
import { HTTPError } from 'ky'
import { me } from '@/features/auth/api'
import { useAuthStore } from '@/store/auth'

// Checks /me once per page load, so a token that expired while the tab was closed is caught
// before any page renders.
export async function requireSession() {
  const session = useAuthStore.getState()

  if (!session.token) {
    throw redirect({ to: '/login' })
  }

  if (!session.user) {
    try {
      session.setUser(await me())
    } catch (error) {
      // Only a 401 means the token is bad. A server that is down keeps the person signed in.
      if (error instanceof HTTPError && error.response.status === 401) {
        session.signOut()
        throw redirect({ to: '/login' })
      }
      throw error
    }
  }
}

export function redirectIfSignedIn() {
  if (useAuthStore.getState().token) {
    throw redirect({ to: '/' })
  }
}
