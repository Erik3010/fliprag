import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { Loader2, Pencil, Play, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { generationSteps } from '@/features/decks/hooks/use-generation-walk'

type DeckEditorHeaderProps = {
  deckId: string
  title: string
  cardCount: number
  generation: { walking: boolean; step: number; notConnected: boolean }
  onTitleChange: (value: string) => void
  onDelete: () => void
}

export function DeckEditorHeader({
  deckId,
  title,
  cardCount,
  generation,
  onTitleChange,
  onDelete,
}: DeckEditorHeaderProps) {
  const canStudy = cardCount > 0
  const titleInput = useRef<HTMLInputElement>(null)

  return (
    <header className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 flex-1 basis-80 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-1">
            <input
              ref={titleInput}
              value={title}
              onChange={(event) => onTitleChange(event.currentTarget.value)}
              aria-label="Deck title"
              placeholder="Untitled deck"
              className="-ml-2 field-sizing-content h-12 min-w-48 max-w-full rounded-lg border border-transparent bg-transparent px-2 py-1 font-semibold text-3xl tracking-tight outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
            />
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
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-muted-foreground text-xs">
            <StatusPill generation={generation} />

            <span>
              {cardCount} {cardCount === 1 ? 'card' : 'cards'}
            </span>

            <span aria-hidden="true" className="size-1 rounded-full bg-border" />

            <span>Not saved yet, changes are lost on reload</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {canStudy ? (
            <Button asChild size="lg" className="px-4">
              <Link to="/decks/$deckId/study" params={{ deckId }}>
                <Play aria-hidden="true" />
                Study
              </Link>
            </Button>
          ) : (
            <Button type="button" size="lg" className="px-4" disabled>
              <Play aria-hidden="true" />
              Study
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Delete deck"
            className="hover:border-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>

      {!canStudy && (
        <p className="text-muted-foreground text-xs">
          Studying is off until this deck has at least one card.
        </p>
      )}
    </header>
  )
}

function StatusPill({ generation }: Pick<DeckEditorHeaderProps, 'generation'>) {
  if (generation.walking) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-ring bg-accent py-1 pr-2.5 pl-2 font-medium text-accent-foreground">
        <Loader2 className="size-3 animate-spin text-primary" aria-hidden="true" />
        Generating · step {generation.step + 1} of {generationSteps.length}
      </span>
    )
  }

  if (generation.notConnected) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-secondary bg-secondary/10 py-1 pr-2.5 pl-2 font-medium text-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
        Generation not connected
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border bg-muted py-1 pr-2.5 pl-2 font-medium text-foreground">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ring" />
      Written by hand
    </span>
  )
}
