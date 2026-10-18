import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'
import { StudySession } from '@/features/study/components/study-session'

export const Route = createFileRoute('/_focus/decks/$deckId/study')({
  head: () => ({ meta: [{ title: 'Study' }] }),
  component: Study,
})

// TODO: load the deck and its cards from the server. Placeholder rows until then.
function Study() {
  const { deckId } = Route.useParams()
  const deck = placeholderDeckDetails.find((row) => row.id === deckId)
  const cards = placeholderCards[deckId] ?? []

  if (deck && cards.length > 0) {
    return <StudySession deckId={deck.id} deckTitle={deck.title} cards={cards} />
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      {deck ? (
        <EmptyState
          title="Nothing to study yet"
          description={`${deck.title} has no cards. Write the first one in the editor and come back.`}
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
      ) : (
        <DeckNotFound className="w-full max-w-sm" />
      )}
    </main>
  )
}
