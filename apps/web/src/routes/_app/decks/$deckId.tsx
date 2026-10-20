import { ErrorState } from '@fliprag/ui/components/error-state'
import { createFileRoute } from '@tanstack/react-router'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { DeckBackLink } from '@/features/decks/components/editor/back-link'
import { DeckEditor } from '@/features/decks/components/editor/deck-editor'
import { generationOf } from '@/features/decks/generation'
import { useDeck } from '@/features/decks/hooks/use-deck'

export const Route = createFileRoute('/_app/decks/$deckId')({
  head: () => ({ meta: [{ title: 'Deck' }] }),
  component: DeckPage,
})

function DeckPage() {
  const { deckId } = Route.useParams()
  const { deck, loading, notFound, error, retry } = useDeck(deckId)

  if (deck) {
    // A new key when generation ends, so editing starts from the cards the job wrote.
    const making = generationOf(deck.progress).walking
    return <DeckEditor key={making ? `${deck.id}-making` : deck.id} deck={deck} />
  }

  return (
    <div className="flex flex-col gap-5">
      <DeckBackLink />
      {loading ? (
        <div aria-hidden="true" className="h-96 animate-pulse rounded-xl bg-muted" />
      ) : notFound ? (
        <DeckNotFound />
      ) : (
        <ErrorState title="The deck could not be loaded" detail={error} onRetry={retry} />
      )}
    </div>
  )
}
