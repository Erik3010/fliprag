import type { Credentials } from '@fliprag/schemas/auth'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/features/auth/api'
import { failureMessage } from '@/shared/api'

export function useLogin() {
  const mutation = useMutation({ mutationFn: login })

  return {
    submit: (credentials: Credentials) => mutation.mutate(credentials),
    pending: mutation.isPending,
    error: mutation.error ? failureMessage(mutation.error) : undefined,
  }
}
