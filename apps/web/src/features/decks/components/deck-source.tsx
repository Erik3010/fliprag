import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

type DeckSourceProps = {
  documentName: string
}

// The document is what the deck was made from, so it is named here and not changeable. A deck
// from a different document is a new deck.
// TODO: open the file itself once one is stored. It points at the documents list until then.
export function DeckSource({ documentName }: DeckSourceProps) {
  return (
    <Link
      to="/documents"
      className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs outline-offset-2 outline-ring transition-colors hover:border-ring focus-visible:outline-2"
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent"
      >
        <FileText className="size-4 text-secondary" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Made from
        </span>
        <span className="truncate font-medium text-sm">{documentName}</span>
      </span>

      <span className="shrink-0 font-semibold text-primary text-xs">Open</span>
    </Link>
  )
}
