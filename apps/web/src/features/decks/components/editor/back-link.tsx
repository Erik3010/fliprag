import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export function DeckBackLink() {
  return (
    <Link
      to="/"
      className="flex items-center gap-1.5 self-start rounded-sm font-medium text-muted-foreground text-sm outline-offset-2 outline-ring transition-colors hover:text-foreground focus-visible:outline-2"
    >
      <ChevronLeft className="size-3.5" aria-hidden="true" />
      All decks
    </Link>
  )
}
