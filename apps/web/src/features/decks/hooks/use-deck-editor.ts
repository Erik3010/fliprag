import { toast } from '@fliprag/ui/components/sonner'
import { useCallback, useReducer, useState } from 'react'
import { cardsReducer } from '@/features/cards/reducer'
import type { Card } from '@/features/cards/types'
import { useGenerationWalk } from '@/features/decks/hooks/use-generation-walk'
import { useSaveStatus } from '@/features/decks/hooks/use-save-status'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'

const UNDO_WINDOW_MS = 8000

type Fields = { title: string; description: string }

// Everything the editor screen needs, in one place. The deck's own fields, its cards, whether it
// is still being made, and the saved indicator.
// TODO: load the deck and its cards from the server, and put every edit through the API. Until
// then edits live here and are gone on reload, the same as the documents screen.
export function useDeckEditor(deckId: string) {
  const deck = placeholderDeckDetails.find((row) => row.id === deckId)

  const generation = useGenerationWalk(deck?.status)
  const saves = useSaveStatus()
  const [fields, setFields] = useState<Fields>({
    title: deck?.title ?? '',
    description: deck?.description ?? '',
  })
  const [cards, dispatch] = useReducer(cardsReducer, placeholderCards[deckId] ?? [])

  // A `data-focus` key the card list moves focus to after a move or an add, then clears.
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const clearFocus = useCallback(() => setFocusKey(null), [])

  const setField = useCallback(
    (key: keyof Fields, value: string) => {
      saves.touch(key)
      setFields((current) => ({ ...current, [key]: value }))
    },
    [saves.touch],
  )

  const addCard = useCallback(() => {
    const id = crypto.randomUUID()
    dispatch({ type: 'add', id })
    setFocusKey(`front-${id}`)
  }, [])

  const updateCard = useCallback(
    (id: string, patch: Partial<Pick<Card, 'front' | 'back'>>) => {
      saves.touch(`card-${id}`)
      dispatch({ type: 'update', id, patch })
    },
    [saves.touch],
  )

  // Focus follows the button that was pressed, so the same key moves the card again.
  const moveCard = useCallback(
    (id: string, direction: -1 | 1) => {
      dispatch({ type: 'move', id, direction })
      setFocusKey(`${direction < 0 ? 'up' : 'down'}-${id}`)
      saves.flash('order')
    },
    [saves.flash],
  )

  // Deleting does not ask first. The toast is the way back, for as long as it stays on screen.
  const removeCard = useCallback(
    (id: string) => {
      const index = cards.findIndex((card) => card.id === id)
      const card = cards[index]
      if (!card) {
        return
      }
      dispatch({ type: 'remove', id })
      toast('Card deleted.', {
        duration: UNDO_WINDOW_MS,
        action: { label: 'Undo', onClick: () => dispatch({ type: 'restore', card, index }) },
      })
    },
    [cards],
  )

  return {
    deck,
    ...fields,
    cards,
    generation,
    savedKey: saves.savedKey,
    focusKey,
    clearFocus,
    setTitle: (value: string) => setField('title', value),
    setDescription: (value: string) => setField('description', value),
    commit: saves.commit,
    addCard,
    updateCard,
    moveCard,
    removeCard,
  }
}
