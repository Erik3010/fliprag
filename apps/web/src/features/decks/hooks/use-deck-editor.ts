import { toast } from '@fliprag/ui/components/sonner'
import { useCallback, useReducer, useState } from 'react'
import { type CardsAction, cardsReducer } from '@/features/cards/reducer'
import type { Card } from '@/features/cards/types'
import { useGenerationWalk } from '@/features/decks/hooks/use-generation-walk'
import { useSaveShortcut } from '@/features/decks/hooks/use-save-shortcut'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'

const UNDO_WINDOW_MS = 8000

type Fields = { title: string; description: string }

// TODO: load the deck from the server and make save() call the API. Until then saving only
// hides the bar, and a reload loses everything.
export function useDeckEditor(deckId: string) {
  const deck = placeholderDeckDetails.find((row) => row.id === deckId)

  const generation = useGenerationWalk(deck?.status)
  const [fields, setFields] = useState<Fields>({
    title: deck?.title ?? '',
    description: deck?.description ?? '',
  })
  const [cards, dispatch] = useReducer(cardsReducer, placeholderCards[deckId] ?? [])
  const [unsaved, setUnsaved] = useState(false)

  const [focusKey, setFocusKey] = useState<string | null>(null)
  const clearFocus = useCallback(() => setFocusKey(null), [])

  const change = useCallback((action: CardsAction) => {
    dispatch(action)
    setUnsaved(true)
  }, [])

  const setField = useCallback((key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }))
    setUnsaved(true)
  }, [])

  const save = useCallback(() => {
    setUnsaved(false)
    toast.success('Changes saved.')
  }, [])

  useSaveShortcut(save, unsaved)

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

  // No confirm on delete: the toast's Undo is the way back.
  const removeCard = useCallback(
    (id: string) => {
      const index = cards.findIndex((card) => card.id === id)
      const card = cards[index]
      if (!card) {
        return
      }
      change({ type: 'remove', id })
      toast.success('Card deleted.', {
        duration: UNDO_WINDOW_MS,
        action: { label: 'Undo', onClick: () => change({ type: 'restore', card, index }) },
      })
    },
    [cards, change],
  )

  return {
    deck,
    ...fields,
    cards,
    generation,
    unsaved,
    save,
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
