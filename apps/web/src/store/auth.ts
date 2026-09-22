import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthUser = { id: string; email: string }

type AuthState = {
  /** Persisted. Sent as a Bearer token on every request while set. */
  token: string | null
  /** In memory only. Filled by /me on load, so it is never stale after a reload. */
  user: AuthUser | null
  signIn: (session: { token: string; user: AuthUser }) => void
  setUser: (user: AuthUser) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: ({ token, user }) => set({ token, user }),
      setUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: 'fliprag.auth', partialize: (state) => ({ token: state.token }) },
  ),
)
