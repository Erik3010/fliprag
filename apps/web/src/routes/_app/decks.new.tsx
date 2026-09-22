import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, Upload } from 'lucide-react'
import { NewDeckForm } from '@/features/decks/components/new-deck-form'
import { placeholderDocuments } from '@/features/documents/placeholder'

export const Route = createFileRoute('/_app/decks/new')({
  component: NewDeck,
})

// TODO: load the documents from the server. Placeholder rows until then.
function NewDeck() {
  const documents = placeholderDocuments

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2.5">
        <Link
          to="/"
          className="flex items-center gap-1.5 self-start rounded-sm font-medium text-muted-foreground text-sm outline-offset-2 outline-ring transition-colors hover:text-foreground focus-visible:outline-2"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Home
        </Link>

        <h1 className="font-semibold text-3xl tracking-tight">New deck</h1>

        <p className="text-muted-foreground text-sm">
          {documents.length > 0
            ? 'Pick the document it comes from, then say what it should cover.'
            : 'Every deck is made from one document.'}
        </p>
      </header>

      {documents.length > 0 ? <NewDeckForm documents={documents} /> : <NoDocuments />}
    </div>
  )
}

function NoDocuments() {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-xl border bg-card px-8 py-11 text-center shadow-xs">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-accent">
        <Upload className="size-5 text-accent-foreground" />
      </span>

      <p className="font-semibold text-lg tracking-tight">Upload a PDF to start</p>

      <p className="max-w-[40ch] text-pretty text-muted-foreground text-sm">
        A deck is always made from one document. Add the lecture, chapter, or paper you want to
        study, then come back here.
      </p>

      <Button asChild size="lg" className="mt-1.5 px-5">
        <Link to="/documents">Go to Documents</Link>
      </Button>
    </div>
  )
}
