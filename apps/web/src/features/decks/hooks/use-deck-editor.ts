import { toast } from '@fliprag/ui/components/sonner'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card } from '@/features/cards/types'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'

// The three steps the real pipeline will report into. Phase 2 replaces the timer below with what
// the server says, and the screen stays as it is.
export const generationSteps = [
  'Reading the document',
  'Finding the passages that match the topics',
  'Writing the cards',
] as const

const STEP_PACE_MS = 1500
const SAVED_FLASH_MS = 2800
const UNDO_WINDOW_MS = 8000

// TODO: load the deck and its cards from the server, and put every edit through the API. Until
// then edits live in this hook and are gone on reload, the same as the documents screen.
export function useDeckEditor(deckId: string) {
  const deck = placeholderDeckDetails.find((row) => row.id === deckId)

  const [title, setTitle] = useState(deck?.title ?? '')
  const [description, setDescription] = useState(deck?.description ?? '')
  const [cards, setCards] = useState<Card[]>(placeholderCards[deckId] ?? [])

  // How far the stand-in has walked. At generationSteps.length the walk is over.
  const [step, setStep] = useState(deck?.status === 'generating' ? 0 : generationSteps.length)
  const [savedKey, setSavedKey] = useState<string | null>(null)
  const [focusKey, setFocusKey] = useState<string | null>(null)

  // Which fields changed since they were last left. A blur on an untouched field is not a save.
  const dirty = useRef(new Set<string>())
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const walking = deck?.status === 'generating' && step < generationSteps.length

  // One timer per step, re-armed each time the step changes, until the walk is over.
  useEffect(() => {
    if (!walking) {
      return
    }
    const timer = setTimeout(() => setStep(step + 1), STEP_PACE_MS)
    return () => clearTimeout(timer)
  }, [walking, step])

  useEffect(() => () => clearTimeout(savedTimer.current), [])

  const touch = useCallback((key: string) => {
    dirty.current.add(key)
  }, [])

  const commit = useCallback((key: string) => {
    if (!dirty.current.delete(key)) {
      return
    }
    clearTimeout(savedTimer.current)
    setSavedKey(key)
    savedTimer.current = setTimeout(() => setSavedKey(null), SAVED_FLASH_MS)
  }, [])

  const addCard = useCallback(() => {
    const id = crypto.randomUUID()
    setCards((current) => [...current, { id, front: '', back: '' }])
    setFocusKey(`front-${id}`)
  }, [])

  const updateCard = useCallback(
    (id: string, patch: Partial<Pick<Card, 'front' | 'back'>>) => {
      touch(`card-${id}`)
      setCards((current) => current.map((card) => (card.id === id ? { ...card, ...patch } : card)))
    },
    [touch],
  )

  const moveCard = useCallback(
    (id: string, direction: -1 | 1) => {
      setCards((current) => {
        const from = current.findIndex((card) => card.id === id)
        const to = from + direction
        if (from < 0 || to < 0 || to >= current.length) {
          return current
        }
        const next = current.slice()
        next[from] = current[to] as Card
        next[to] = current[from] as Card
        return next
      })
      // Focus follows the button that was pressed, so the same key moves the card again.
      setFocusKey(`${direction < 0 ? 'up' : 'down'}-${id}`)
      touch('order')
      commit('order')
    },
    [touch, commit],
  )

  // Deleting does not ask first. The toast is the way back, for as long as it stays on screen.
  const removeCard = useCallback(
    (id: string) => {
      const index = cards.findIndex((card) => card.id === id)
      const card = cards[index]
      if (!card) {
        return
      }
      setCards((current) => current.filter((row) => row.id !== id))
      toast('Card deleted.', {
        duration: UNDO_WINDOW_MS,
        action: {
          label: 'Undo',
          onClick: () =>
            setCards((current) => {
              const next = current.slice()
              next.splice(Math.min(index, next.length), 0, card)
              return next
            }),
        },
      })
    },
    [cards],
  )

  const clearFocus = useCallback(() => setFocusKey(null), [])

  return {
    deck,
    title,
    description,
    cards,
    savedKey,
    focusKey,
    generation: {
      walking,
      step,
      // The stand-in has finished and, this being phase 1, wrote nothing.
      notConnected: deck?.status === 'generating' && !walking,
    },
    setTitle: (value: string) => {
      touch('title')
      setTitle(value)
    },
    setDescription: (value: string) => {
      touch('description')
      setDescription(value)
    },
    commit,
    addCard,
    updateCard,
    moveCard,
    removeCard,
    clearFocus,
  }
}
