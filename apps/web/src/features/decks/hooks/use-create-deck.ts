import type { NewDeck } from '@fliprag/schemas/deck'
import { toast } from '@fliprag/ui/components/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createDeck } from '@/features/decks/api'
import { decksQueryKey } from '@/features/decks/hooks/use-decks'
import { failureMessage } from '@/lib/http'

export function useCreateDeck() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createDeck,
    onSuccess: (deck) => {
      queryClient.invalidateQueries({ queryKey: decksQueryKey, exact: true })
      navigate({ to: '/decks/$deckId', params: { deckId: deck.id } })
    },
    onError: (error) => toast.error(`Failed to create deck. ${failureMessage(error)}`),
  })

  return {
    submit: (deck: NewDeck) => mutation.mutate(deck),
    pending: mutation.isPending,
  }
}
