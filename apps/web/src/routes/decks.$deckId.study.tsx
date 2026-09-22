import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

// Outside /_app on purpose: studying takes over the screen, with no sidebar.
export const Route = createFileRoute('/decks/$deckId/study')({
  component: Study,
})

function Study() {
  const { deckId } = Route.useParams()

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
        <p className="font-semibold text-lg tracking-tight">Studying is not built yet</p>
        <p className="max-w-[36ch] text-pretty text-muted-foreground text-sm">
          This screen will step through the deck one card at a time. Until then, the cards are in
          the editor.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/decks/$deckId" params={{ deckId }}>
            <ChevronLeft aria-hidden="true" />
            Back to the deck
          </Link>
        </Button>
      </div>
    </main>
  )
}
