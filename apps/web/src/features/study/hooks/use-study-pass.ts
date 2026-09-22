import { useEffect, useReducer } from 'react'
import type { Card } from '@/features/cards/types'

export type PassOrder = 'deck' | 'shuffle'
export type PassPhase = 'start' | 'card' | 'end'

type PassState = {
  phase: PassPhase
  order: PassOrder
  queue: Card[]
  index: number
  flipped: boolean
}

type PassAction =
  | { type: 'pick'; order: PassOrder }
  | { type: 'begin'; order: PassOrder; cards: Card[] }
  | { type: 'flip' }
  | { type: 'next' }
  | { type: 'prev' }

function shuffle(cards: Card[]) {
  const out = cards.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = out[i] as Card
    out[i] = out[j] as Card
    out[j] = swap
  }
  return out
}

// A pass is never persisted: every arrival starts the deck again from the top.
function passReducer(state: PassState, action: PassAction): PassState {
  switch (action.type) {
    case 'pick':
      return { ...state, order: action.order }
    case 'begin':
      return {
        phase: 'card',
        order: action.order,
        queue: action.order === 'shuffle' ? shuffle(action.cards) : action.cards,
        index: 0,
        flipped: false,
      }
    case 'flip':
      return { ...state, flipped: !state.flipped }
    case 'next':
      return state.index >= state.queue.length - 1
        ? { ...state, phase: 'end', flipped: false }
        : { ...state, index: state.index + 1, flipped: false }
    case 'prev':
      return state.index === 0 ? state : { ...state, index: state.index - 1, flipped: false }
  }
}

// What each key does in each phase. Anything not listed falls through to the browser.
const keys: Partial<Record<PassPhase, Record<string, 'begin' | 'flip' | 'next' | 'prev'>>> = {
  start: { Enter: 'begin' },
  card: { ' ': 'flip', ArrowRight: 'next', ArrowLeft: 'prev' },
}

function typing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  )
}

export function useStudyPass(cards: Card[]) {
  const [state, dispatch] = useReducer(
    passReducer,
    cards,
    (queue): PassState => ({ phase: 'start', order: 'deck', queue, index: 0, flipped: false }),
  )

  const { phase, order, queue, index, flipped } = state

  // The keyboard drives all of it. The key is swallowed so it cannot also press whichever
  // button has focus, and nothing fires while the person is typing in a field.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const type = keys[phase]?.[event.key]
      if (!type || typing(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      event.preventDefault()
      dispatch(type === 'begin' ? { type, order, cards } : { type })
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [phase, order, cards])

  return {
    phase,
    order,
    total: queue.length,
    index,
    card: queue[index],
    flipped,
    atFirst: index === 0,
    atLast: index >= queue.length - 1,
    pickOrder: (next: PassOrder) => dispatch({ type: 'pick', order: next }),
    begin: (next: PassOrder) => dispatch({ type: 'begin', order: next, cards }),
    flip: () => dispatch({ type: 'flip' }),
    next: () => dispatch({ type: 'next' }),
    prev: () => dispatch({ type: 'prev' }),
  }
}
