import { useEffect, useRef } from 'react'
import { CardEditor } from '@/features/cards/components/card-editor'
import type { Card } from '@/features/cards/types'

type CardListProps = {
  cards: Card[]
  savedKey: string | null
  /** A `data-focus` key to move focus to once the list has rendered, or null. */
  focusKey: string | null
  onFocused: () => void
  onChange: (id: string, patch: Partial<Pick<Card, 'front' | 'back'>>) => void
  onBlur: (id: string) => void
  onMove: (id: string, direction: -1 | 1) => void
  onDelete: (id: string) => void
}

export function CardList({
  cards,
  savedKey,
  focusKey,
  onFocused,
  onChange,
  onBlur,
  onMove,
  onDelete,
}: CardListProps) {
  const list = useRef<HTMLOListElement>(null)

  // After a move or an add, focus goes where the person expects it: the button they pressed,
  // now beside the card in its new place, or the front of the card they just added.
  useEffect(() => {
    if (!focusKey) {
      return
    }
    list.current?.querySelector<HTMLElement>(`[data-focus="${focusKey}"]`)?.focus()
    onFocused()
  }, [focusKey, onFocused])

  return (
    <ol ref={list} className="flex flex-col gap-3.5">
      {cards.map((card, index) => (
        <li key={card.id}>
          <CardEditor
            card={card}
            position={index + 1}
            total={cards.length}
            saved={savedKey === `card-${card.id}`}
            onChange={(patch) => onChange(card.id, patch)}
            onBlur={() => onBlur(card.id)}
            onMove={(direction) => onMove(card.id, direction)}
            onDelete={() => onDelete(card.id)}
          />
        </li>
      ))}
    </ol>
  )
}
