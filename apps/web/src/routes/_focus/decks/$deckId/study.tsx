import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { ErrorState } from '@fliprag/ui/components/error-state'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { useDeck } from '@/features/decks/hooks/use-deck'
import { StudySession } from '@/features/study/components/study-session'

export const Route = createFileRoute('/_focus/decks/$deckId/study')({
  head: () => ({ meta: [{ title: 'Study' }] }),
  component: Study,
})

function Study() {
  const { deckId } = Route.useParams()
  const { deck, loading, notFound, error, retry } = useDeck(deckId)

  if (deck && deck.cards.length > 0) {
    return <StudySession deckId={deck.id} deckTitle={deck.title} cards={deck.cards} />
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      {loading ? (
        <div
          aria-hidden="true"
          className="h-64 w-full max-w-sm animate-pulse rounded-2xl bg-muted"
        />
      ) : deck ? (
        <EmptyState
          title="Nothing to study yet"
          description={`"${deck.title}" deck has no cards. Add cards in the editor to start studying.`}
          action={
            <Button asChild size="lg">
              <Link to="/decks/$deckId" params={{ deckId }}>
                <ChevronLeft aria-hidden="true" />
                Back to the deck
              </Link>
            </Button>
          }
          className="w-full max-w-sm"
        />
      ) : notFound ? (
        <DeckNotFound className="w-full max-w-sm" />
      ) : (
        <ErrorState
          title="The deck could not be loaded"
          detail={error}
          onRetry={retry}
          className="w-full max-w-sm"
        />
      )}
    </main>
  )
}
