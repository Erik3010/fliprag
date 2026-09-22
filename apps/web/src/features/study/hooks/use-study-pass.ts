import { useCallback, useEffect, useState } from 'react'
import type { Card } from '@/features/cards/types'

export type PassOrder = 'deck' | 'shuffle'
export type PassPhase = 'start' | 'card' | 'end'

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

function typing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  )
}

// One pass through a deck. Nothing about it is kept: leaving the screen ends the pass, and coming
// back starts the deck again from the top.
export function useStudyPass(cards: Card[]) {
  const [phase, setPhase] = useState<PassPhase>('start')
  const [order, setOrder] = useState<PassOrder>('deck')
  const [queue, setQueue] = useState<Card[]>(cards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const total = queue.length
  const atFirst = index === 0
  const atLast = index >= total - 1

  const begin = useCallback(
    (next: PassOrder) => {
      setOrder(next)
      setQueue(next === 'shuffle' ? shuffle(cards) : cards)
      setIndex(0)
      setFlipped(false)
      setPhase('card')
    },
    [cards],
  )

  const flip = useCallback(() => setFlipped((current) => !current), [])

  const next = useCallback(() => {
    setFlipped(false)
    if (atLast) {
      setPhase('end')
    } else {
      setIndex((current) => current + 1)
    }
  }, [atLast])

  const prev = useCallback(() => {
    if (atFirst) {
      return
    }
    setFlipped(false)
    setIndex((current) => current - 1)
  }, [atFirst])

  // The keyboard drives all of it: Enter starts, Space flips, the arrows move. Space and Enter
  // are stopped from also pressing whichever button has focus, so a key does one thing.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (typing(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (phase === 'start') {
        if (event.key === 'Enter') {
          event.preventDefault()
          begin(order)
        }
        return
      }

      if (phase !== 'card') {
        return
      }

      if (event.key === ' ') {
        event.preventDefault()
        flip()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [phase, order, begin, flip, next, prev])

  return {
    phase,
    order,
    total,
    index,
    card: queue[Math.min(index, total - 1)],
    flipped,
    atFirst,
    atLast,
    pickOrder: setOrder,
    begin,
    flip,
    next,
    prev,
  }
}
