import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth'

export function useSignOut() {
  const navigate = useNavigate()
  const signOut = useAuthStore((state) => state.signOut)

  return () => {
    signOut()
    navigate({ to: '/login' })
  }
}
