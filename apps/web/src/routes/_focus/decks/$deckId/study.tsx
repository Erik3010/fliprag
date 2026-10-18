import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Card } from '@/features/cards/types'
import { DeckNotFound } from '@/features/decks/components/deck-not-found'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'
import { PassCard } from '@/features/study/components/pass-card'
import { PassEnd } from '@/features/study/components/pass-end'
import { PassStart } from '@/features/study/components/pass-start'
import { StudyHeader } from '@/features/study/components/study-header'
import { useStudyPass } from '@/features/study/hooks/use-study-pass'

export const Route = createFileRoute('/_focus/decks/$deckId/study')({
  head: () => ({ meta: [{ title: 'Study' }] }),
  component: Study,
})

// TODO: load the deck and its cards from the server. Placeholder rows until then.
function Study() {
  const { deckId } = Route.useParams()
  const deck = placeholderDeckDetails.find((row) => row.id === deckId)
  const cards = placeholderCards[deckId] ?? []

  if (!deck) {
    return (
      <Screen>
        <DeckNotFound className="w-full max-w-sm" />
      </Screen>
    )
  }

  if (cards.length === 0) {
    return (
      <Screen>
        <EmptyState
          title="Nothing to study yet"
          description={`${deck.title} has no cards. Write the first one in the editor and come back.`}
          action={
            <Button asChild size="lg" className="px-5">
              <Link to="/decks/$deckId" params={{ deckId }}>
                <ChevronLeft aria-hidden="true" />
                Back to the deck
              </Link>
            </Button>
          }
          className="w-full max-w-sm"
        />
      </Screen>
    )
  }

  return <Pass deckId={deck.id} deckTitle={deck.title} cards={cards} />
}

function Pass({ deckId, deckTitle, cards }: { deckId: string; deckTitle: string; cards: Card[] }) {
  const pass = useStudyPass(cards)

  return (
    <div className="flex min-h-dvh flex-col">
      <StudyHeader deckId={deckId} deckTitle={deckTitle} />

      <main className="flex flex-1 justify-center px-4 pt-6 pb-14 sm:px-6 sm:pt-8">
        <div className="w-full max-w-2xl">
          {pass.phase === 'start' && (
            <PassStart
              deckTitle={deckTitle}
              total={pass.total}
              order={pass.order}
              onPickOrder={pass.pickOrder}
              onStart={() => pass.begin(pass.order)}
            />
          )}

          {pass.phase === 'card' && pass.card && (
            <PassCard
              card={pass.card}
              index={pass.index}
              total={pass.total}
              order={pass.order}
              flipped={pass.flipped}
              atFirst={pass.atFirst}
              atLast={pass.atLast}
              onFlip={pass.flip}
              onPrev={pass.prev}
              onNext={pass.next}
            />
          )}

          {pass.phase === 'end' && (
            <PassEnd deckId={deckId} total={pass.total} order={pass.order} onAgain={pass.begin} />
          )}
        </div>
      </main>
    </div>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return <main className="grid min-h-dvh place-items-center px-5 py-12">{children}</main>
}
