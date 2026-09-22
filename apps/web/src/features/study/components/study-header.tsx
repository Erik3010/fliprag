import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

type StudyHeaderProps = {
  deckId: string
  deckTitle: string
}

// The only chrome on this screen. The sidebar is gone so the card has the room, and the one
// way out goes back to the deck the pass started from, not to home.
export function StudyHeader({ deckId, deckTitle }: StudyHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-sidebar-border border-b bg-sidebar px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          aria-label="Home"
          className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-serif text-lg text-primary-foreground leading-none outline-offset-2 outline-ring focus-visible:outline-2"
        >
          F
        </Link>

        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-sm tracking-tight">{deckTitle}</span>
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Studying
          </span>
        </div>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link to="/decks/$deckId" params={{ deckId }}>
          <X aria-hidden="true" />
          End pass
        </Link>
      </Button>
    </header>
  )
}
