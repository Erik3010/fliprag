import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@fliprag/ui/components/button'
import { Textarea } from '@fliprag/ui/components/textarea'
import { cn } from '@fliprag/ui/lib/utils'
import { GripVertical, Trash2 } from 'lucide-react'
import type { Card } from '@/features/cards/types'

type CardEditorProps = {
  card: Card
  position: number
  total: number
  onChange: (patch: Partial<Pick<Card, 'front' | 'back'>>) => void
  onDelete: () => void
}

// Both faces are edited the same way, in a plain box that a small editor with bold and italic
// takes the place of in a later phase.
const face =
  'min-h-20 bg-background transition-[color,background-color,box-shadow] duration-150 hover:bg-card focus-visible:bg-card'

export function CardEditor({ card, position, total, onChange, onDelete }: CardEditorProps) {
  const frontId = `card-${card.id}-front`
  const backId = `card-${card.id}-back`
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  return (
    <article
      ref={setNodeRef}
      aria-label={`Card ${position} of ${total}`}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        'relative flex flex-col gap-3 rounded-xl border bg-card px-4 pt-3.5 pb-4 shadow-xs',
        isDragging && 'z-10 border-primary shadow-xl ring-3 ring-accent',
      )}
    >
      <div className="flex items-center gap-2.5">
        <Button
          ref={setActivatorNodeRef}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Reorder card ${position}`}
          className="-ml-1.5 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" />
        </Button>

        <span className="whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground text-xs">
          Card {position} of {total}
        </span>

        <span className="flex-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete card ${position}`}
          className="hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={frontId} className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">Front</span>
            <span className="text-muted-foreground text-xs">What you are asked</span>
          </label>
          <Textarea
            id={frontId}
            rows={3}
            value={card.front}
            placeholder="The question"
            data-focus={`front-${card.id}`}
            className={face}
            onChange={(event) => onChange({ front: event.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={backId} className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">Back</span>
            <span className="text-muted-foreground text-xs">What you should recall</span>
          </label>
          <Textarea
            id={backId}
            rows={3}
            value={card.back}
            placeholder="The answer"
            className={face}
            onChange={(event) => onChange({ back: event.currentTarget.value })}
          />
        </div>
      </div>
    </article>
  )
}
