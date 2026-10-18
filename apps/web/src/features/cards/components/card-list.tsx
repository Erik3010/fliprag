import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Modifier,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useRef } from 'react'
import { CardEditor } from '@/features/cards/components/card-editor'
import type { Card } from '@/features/cards/types'

const verticalOnly: Modifier = ({ transform }) => ({ ...transform, x: 0 })

type CardListProps = {
  cards: Card[]
  /** A `data-focus` key to move focus to once the list has rendered, or null. */
  focusKey: string | null
  onFocused: () => void
  onChange: (id: string, patch: Partial<Pick<Card, 'front' | 'back'>>) => void
  onMove: (id: string, to: number) => void
  onDelete: (id: string) => void
}

export function CardList({
  cards,
  focusKey,
  onFocused,
  onChange,
  onMove,
  onDelete,
}: CardListProps) {
  const list = useRef<HTMLOListElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    if (!focusKey) {
      return
    }
    list.current?.querySelector<HTMLElement>(`[data-focus="${focusKey}"]`)?.focus()
    onFocused()
  }, [focusKey, onFocused])

  const position = (id: UniqueIdentifier) => cards.findIndex((card) => card.id === id) + 1

  // The default announcements read out card ids (uuids), so these use positions instead.
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up card ${position(active.id)} of ${cards.length}.`,
    onDragOver: ({ active, over }) =>
      over ? `Card ${position(active.id)} is over position ${position(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `Card ${position(active.id)} dropped at position ${position(over.id)}.`
        : `Card ${position(active.id)} dropped.`,
    onDragCancel: ({ active }) => `Moving cancelled. Card ${position(active.id)} stays put.`,
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      onMove(String(active.id), position(over.id) - 1)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[verticalOnly]}
      accessibility={{ announcements }}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards} strategy={verticalListSortingStrategy}>
        <ol ref={list} className="flex flex-col gap-3.5">
          {cards.map((card, index) => (
            <li key={card.id}>
              <CardEditor
                card={card}
                position={index + 1}
                total={cards.length}
                onChange={(patch) => onChange(card.id, patch)}
                onDelete={() => onDelete(card.id)}
              />
            </li>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}
