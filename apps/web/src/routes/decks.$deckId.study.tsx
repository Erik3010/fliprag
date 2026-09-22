import { Button } from '@fliprag/ui/components/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Card } from '@/features/cards/types'
import { placeholderCards, placeholderDeckDetails } from '@/features/decks/placeholder'
import { PassCard } from '@/features/study/components/pass-card'
import { PassEnd } from '@/features/study/components/pass-end'
import { PassStart } from '@/features/study/components/pass-start'
import { StudyHeader } from '@/features/study/components/study-header'
import { useStudyPass } from '@/features/study/hooks/use-study-pass'

// Outside /_app on purpose: studying takes over the screen, with no sidebar.
export const Route = createFileRoute('/decks/$deckId/study')({
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
        <Panel
          title="There is no deck here"
          line="It may have been deleted, or the link may be wrong. Your decks are all on the home screen."
          action={<Link to="/">All decks</Link>}
        />
      </Screen>
    )
  }

  if (cards.length === 0) {
    return (
      <Screen>
        <Panel
          title="Nothing to study yet"
          line={`${deck.title} has no cards. Write the first one in the editor and come back.`}
          action={
            <Link to="/decks/$deckId" params={{ deckId }}>
              <ChevronLeft aria-hidden="true" />
              Back to the deck
            </Link>
          }
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

function Panel({ title, line, action }: { title: string; line: string; action: ReactNode }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
      <p className="font-semibold text-lg tracking-tight">{title}</p>
      <p className="max-w-[42ch] text-pretty text-muted-foreground text-sm">{line}</p>
      <Button asChild variant="outline" className="mt-2">
        {action}
      </Button>
    </div>
  )
}
