import type { Credentials } from '@fliprag/schemas/auth'
import { useMutation } from '@tanstack/react-query'
import { signup } from '@/features/auth/api'
import { failureMessage } from '@/shared/api'

export function useSignup() {
  const mutation = useMutation({ mutationFn: signup })

  return {
    submit: (credentials: Credentials) => mutation.mutate(credentials),
    pending: mutation.isPending,
    error: mutation.error ? failureMessage(mutation.error) : undefined,
  }
}
