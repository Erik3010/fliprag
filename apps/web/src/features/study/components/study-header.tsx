import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

type StudyHeaderProps = {
  deckId: string
  deckTitle: string
}

export function StudyHeader({ deckId, deckTitle }: StudyHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-sidebar-border border-b bg-sidebar px-5">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold text-sm tracking-tight">{deckTitle}</span>
        <span className="text-muted-foreground text-xs">Studying</span>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link to="/decks/$deckId" params={{ deckId }}>
          <X aria-hidden="true" />
          Stop studying
        </Link>
      </Button>
    </header>
  )
}
