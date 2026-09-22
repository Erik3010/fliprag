import { redirect } from '@tanstack/react-router'
import { me } from '@/features/auth/api'
import { useAuthStore } from '@/store/auth'

// beforeLoad for /_app. Calls /me once per page load, so a token that expired while the tab was
// closed is caught before any screen renders on it.
export async function requireSession() {
  const session = useAuthStore.getState()

  if (!session.token) {
    throw redirect({ to: '/login' })
  }

  if (!session.user) {
    try {
      session.setUser(await me())
    } catch {
      session.signOut()
      throw redirect({ to: '/login' })
    }
  }
}

// beforeLoad for /login and /signup: a signed-in person has no business there.
export function redirectIfSignedIn() {
  if (useAuthStore.getState().token) {
    throw redirect({ to: '/' })
  }
}
