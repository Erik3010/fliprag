import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { ErrorState } from '@fliprag/ui/components/error-state'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, Upload } from 'lucide-react'
import { NewDeckForm } from '@/features/decks/components/create/form'
import { useCreateDeck } from '@/features/decks/hooks/use-create-deck'
import { useDocuments } from '@/features/documents/hooks/use-documents'

export const Route = createFileRoute('/_app/decks/new')({
  head: () => ({ meta: [{ title: 'Create deck' }] }),
  component: NewDeck,
})

function NewDeck() {
  const { documents = [], loading, error, retry } = useDocuments()
  const create = useCreateDeck()

  function content() {
    if (error) {
      return <ErrorState title="Documents could not be loaded" detail={error} onRetry={retry} />
    }

    if (loading) {
      return <div aria-hidden="true" className="h-96 animate-pulse rounded-xl bg-muted" />
    }

    if (documents.length === 0) {
      return (
        <EmptyState
          icon={<Upload className="size-5 text-accent-foreground" />}
          title="No documents yet"
          description="A document is required to create a flashcard deck."
          action={
            <Button asChild size="lg">
              <Link to="/documents">Upload a document</Link>
            </Button>
          }
        />
      )
    }

    return <NewDeckForm documents={documents} onSubmit={create.submit} pending={create.pending} />
  }

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

        <h1 className="font-semibold text-3xl tracking-tight">Create deck</h1>

        <p className="text-muted-foreground text-sm">Generate flashcards from a PDF document.</p>
      </header>

      {content()}
    </div>
  )
}
