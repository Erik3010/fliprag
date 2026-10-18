import type { Card } from '@/features/cards/types'
import { PassCard } from '@/features/study/components/pass/card'
import { PassEnd } from '@/features/study/components/pass/end'
import { PassStart } from '@/features/study/components/pass/start'
import { StudyHeader } from '@/features/study/components/study-header'
import { useStudyPass } from '@/features/study/hooks/use-study-pass'

type StudySessionProps = {
  deckId: string
  deckTitle: string
  cards: Card[]
}

export function StudySession({ deckId, deckTitle, cards }: StudySessionProps) {
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
