import { toast } from '@fliprag/ui/components/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useReducer, useState } from 'react'
import { type CardsAction, cardsReducer } from '@/features/cards/reducer'
import type { Card } from '@/features/cards/types'
import { deleteDeck, updateDeck } from '@/features/decks/api'
import { generationOf } from '@/features/decks/generation'
import { deckQueryKey } from '@/features/decks/hooks/use-deck'
import { decksQueryKey } from '@/features/decks/hooks/use-decks'
import { useSaveShortcut } from '@/features/decks/hooks/use-save-shortcut'
import type { DeckDetail } from '@/features/decks/types'
import { useOpenDocument } from '@/features/documents/hooks/use-open-document'
import { failureMessage } from '@/lib/http'

type Fields = { title: string; description: string }

export function useDeckEditor(deck: DeckDetail) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const openDocument = useOpenDocument()

  const [fields, setFields] = useState<Fields>({
    title: deck.title,
    description: deck.description ?? '',
  })
  const [cards, dispatch] = useReducer(cardsReducer, deck.cards)
  const [unsaved, setUnsaved] = useState(false)

  const [focusKey, setFocusKey] = useState<string | null>(null)
  const clearFocus = useCallback(() => setFocusKey(null), [])

  const saveMutation = useMutation({
    mutationFn: () => updateDeck(deck.id, { ...fields, cards }),
    onSuccess: (saved) => {
      queryClient.setQueryData(deckQueryKey(deck.id), saved)
      queryClient.invalidateQueries({ queryKey: decksQueryKey, exact: true })
      setUnsaved(false)
      toast.success('Changes saved successfully.')
    },
    onError: (error) => toast.error(`Failed to save changes. ${failureMessage(error)}`),
  })

  const removeMutation = useMutation({
    mutationFn: () => deleteDeck(deck.id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: deckQueryKey(deck.id) })
      queryClient.invalidateQueries({ queryKey: decksQueryKey, exact: true })
      toast.success('Deck deleted successfully.')
      navigate({ to: '/' })
    },
    onError: (error) => toast.error(`Failed to delete deck. ${failureMessage(error)}`),
  })

  const saving = saveMutation.isPending
  const save = useCallback(() => saveMutation.mutate(), [saveMutation])

  useSaveShortcut(save, unsaved && !saving)

  const change = useCallback((action: CardsAction) => {
    dispatch(action)
    setUnsaved(true)
  }, [])

  const setField = useCallback((key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }))
    setUnsaved(true)
  }, [])

  const addCard = useCallback(() => {
    const id = crypto.randomUUID()
    change({ type: 'add', id })
    setFocusKey(`front-${id}`)
  }, [change])

  const updateCard = useCallback(
    (id: string, patch: Partial<Pick<Card, 'front' | 'back'>>) => {
      change({ type: 'update', id, patch })
    },
    [change],
  )

  const moveCard = useCallback(
    (id: string, to: number) => {
      change({ type: 'move', id, to })
    },
    [change],
  )

  const removeCard = useCallback(
    (id: string) => {
      change({ type: 'remove', id })
      toast.success('Card deleted successfully.')
    },
    [change],
  )

  return {
    ...fields,
    cards,
    generation: generationOf(deck.progress),
    unsaved,
    saving,
    save,
    remove: () => removeMutation.mutate(),
    openDocument: () => openDocument(deck.documentId),
    removing: removeMutation.isPending,
    focusKey,
    clearFocus,
    setTitle: (value: string) => setField('title', value),
    setDescription: (value: string) => setField('description', value),
    addCard,
    updateCard,
    moveCard,
    removeCard,
  }
}
