import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { DeckMark } from '@/features/decks/components/deck-mark'
import type { Deck } from '@/features/decks/types'
import { relativeDay } from '@/shared/relative-time'

type DeckListProps = {
  decks: Deck[]
  empty: ReactNode
  pageSize?: number
}

export function DeckList({ decks, empty, pageSize = 6 }: DeckListProps) {
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(decks.length / pageSize)
  const start = page * pageSize
  const shown = decks.slice(start, start + pageSize)

  return (
    <section aria-labelledby="decks-heading" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-b pb-3">
        <h2 id="decks-heading" className="font-semibold text-lg tracking-tight">
          Your decks
        </h2>

        {decks.length > 0 && (
          <p className="font-mono text-muted-foreground text-xs">
            {start + 1} to {start + shown.length} of {decks.length}
          </p>
        )}
      </div>

      {decks.length === 0 ? (
        empty
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] items-stretch gap-3.5">
          {shown.map((deck) => (
            <li key={deck.id}>
              <Link
                to="/decks/$deckId"
                params={{ deckId: deck.id }}
                className="flex h-full flex-col gap-3.5 rounded-xl border bg-card p-5 shadow-xs outline-offset-2 outline-ring transition-all duration-150 hover:-translate-y-0.5 hover:border-ring hover:shadow-lg focus-visible:outline-2"
              >
                <span className="flex items-start justify-between gap-3">
                  <DeckMark />
                  <span className="whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-medium font-mono text-accent-foreground text-xs">
                    {deck.cardCount} cards
                  </span>
                </span>

                <span className="flex flex-col gap-1.5">
                  <span className="text-pretty font-semibold text-lg tracking-tight">
                    {deck.title}
                  </span>

                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground text-xs">
                    <FileText className="size-3.5 shrink-0 text-secondary" aria-hidden="true" />
                    <span className="truncate">{deck.documentName}</span>
                  </span>
                </span>

                {/* The column gap sets the smallest space above the rule, the auto margin takes any
                    slack, so every footer in a row sits on the same line whatever the title does. */}
                <span className="mt-auto border-t border-dashed pt-3 text-muted-foreground text-xs">
                  Edited {relativeDay(deck.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <div className="flex justify-end gap-2 pt-1.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}
