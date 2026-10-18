import type { Signup } from '@fliprag/schemas/auth'
import { toast } from '@fliprag/ui/components/sonner'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { signup } from '@/features/auth/api'
import { failureMessage } from '@/lib/http'
import { useAuthStore } from '@/store/auth'

export function useSignup() {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (session) => {
      signIn(session)
      navigate({ to: '/' })
    },
    onError: (error) => toast.error(`Failed to create account. ${failureMessage(error)}`),
  })

  return {
    submit: (details: Signup) => mutation.mutate(details),
    pending: mutation.isPending,
  }
}
