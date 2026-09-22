import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

type DeckListEmptyProps = {
  hasDocument: boolean
}

// Two states share this panel. Without a document there is nothing to build a deck from, so it asks
// for a PDF instead of for a deck.
export function DeckListEmpty({ hasDocument }: DeckListEmptyProps) {
  const content = hasDocument
    ? {
        title: 'No decks yet',
        body: 'Make your first deck from one of your documents.',
        action: 'Create a deck',
        to: '/decks/new' as const,
      }
    : {
        title: 'No documents yet',
        body: 'Upload a PDF first. A deck is made from a document, and cannot exist without one.',
        action: 'Upload a PDF',
        to: '/documents' as const,
      }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent"
      >
        <FileText className="size-5 text-accent-foreground" />
      </span>

      <p className="font-semibold text-lg tracking-tight">{content.title}</p>

      <p className="max-w-[42ch] text-pretty text-muted-foreground text-sm">{content.body}</p>

      <Button asChild size="lg" className="mt-2 px-5">
        <Link to={content.to}>{content.action}</Link>
      </Button>
    </div>
  )
}
