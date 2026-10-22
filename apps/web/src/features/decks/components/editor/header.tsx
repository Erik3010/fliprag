import { Button } from '@fliprag/ui/components/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { StatusPill } from '@/features/decks/components/editor/status-pill'
import type { Generation } from '@/features/decks/generation'

type DeckEditorHeaderProps = {
  title: string
  cardCount: number
  generation: Generation
  /** True while the deck is being made: the title cannot be edited yet. */
  locked: boolean
  onTitleChange: (value: string) => void
  onDelete: () => void
}

export function DeckEditorHeader({
  title,
  cardCount,
  generation,
  locked,
  onTitleChange,
  onDelete,
}: DeckEditorHeaderProps) {
  const titleInput = useRef<HTMLInputElement>(null)

  return (
    <header className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 flex-1 basis-80 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-1">
            <input
              ref={titleInput}
              value={title}
              readOnly={locked}
              onChange={(event) => onTitleChange(event.currentTarget.value)}
              aria-label="Deck title"
              placeholder="Untitled deck"
              className="-ml-2 field-sizing-content h-12 max-w-full rounded-lg border border-transparent bg-transparent px-2 py-1 font-semibold text-3xl tracking-tight outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {!locked && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Edit title"
                className="shrink-0 text-muted-foreground"
                onClick={() => titleInput.current?.focus()}
              >
                <Pencil aria-hidden="true" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground text-xs">
            <StatusPill generation={generation} />

            <span>
              {cardCount} {cardCount === 1 ? 'card' : 'cards'}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Delete deck"
            className="hover:border-destructive hover:text-destructive"
            disabled={locked}
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
