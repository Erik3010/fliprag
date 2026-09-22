import type { Credentials } from '@fliprag/schemas/auth'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login } from '@/features/auth/api'
import { failureMessage } from '@/lib/http'
import { useAuthStore } from '@/store/auth'

export function useLogin() {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session)
      navigate({ to: '/' })
    },
  })

  return {
    submit: (credentials: Credentials) => mutation.mutate(credentials),
    pending: mutation.isPending,
    error: mutation.error ? failureMessage(mutation.error) : undefined,
  }
}
