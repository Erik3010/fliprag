import { Button } from '@fliprag/ui/components/button'
import { Textarea } from '@fliprag/ui/components/textarea'
import { ArrowDown, ArrowUp, Check, Trash2 } from 'lucide-react'
import type { Card } from '@/features/cards/types'

type CardEditorProps = {
  card: Card
  position: number
  total: number
  saved: boolean
  onChange: (patch: Partial<Pick<Card, 'front' | 'back'>>) => void
  onBlur: () => void
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
}

// Both faces are edited the same way, in a plain box that a small editor with bold and italic
// takes the place of in a later phase.
const face = 'min-h-20 bg-background hover:bg-card focus-visible:bg-card'

export function CardEditor({
  card,
  position,
  total,
  saved,
  onChange,
  onBlur,
  onMove,
  onDelete,
}: CardEditorProps) {
  const frontId = `card-${card.id}-front`
  const backId = `card-${card.id}-back`

  return (
    <article
      aria-label={`Card ${position} of ${total}`}
      className="flex flex-col gap-3 rounded-xl border bg-card px-4 pt-3.5 pb-4 shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <span className="whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-medium font-mono text-accent-foreground text-xs">
          Card {position} of {total}
        </span>

        {saved && (
          <span className="flex items-center gap-1.5 text-primary text-xs" role="status">
            <Check className="size-3" aria-hidden="true" />
            Saved
          </span>
        )}

        <span className="flex-1" />

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={position === 1}
            aria-label={`Move card ${position} up`}
            data-focus={`up-${card.id}`}
            onClick={() => onMove(-1)}
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={position === total}
            aria-label={`Move card ${position} down`}
            data-focus={`down-${card.id}`}
            onClick={() => onMove(1)}
          >
            <ArrowDown aria-hidden="true" />
          </Button>
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
      </div>

      <div className="grid gap-3">
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
            onBlur={onBlur}
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
            onBlur={onBlur}
          />
        </div>
      </div>
    </article>
  )
}
