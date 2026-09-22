import { Button } from '@fliprag/ui/components/button'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Card } from '@/features/cards/types'
import { FlipCard } from '@/features/study/components/flip-card'
import type { PassOrder } from '@/features/study/hooks/use-study-pass'

type PassCardProps = {
  card: Card
  index: number
  total: number
  order: PassOrder
  flipped: boolean
  atFirst: boolean
  atLast: boolean
  onFlip: () => void
  onPrev: () => void
  onNext: () => void
}

export function PassCard({
  card,
  index,
  total,
  order,
  flipped,
  atFirst,
  atLast,
  onFlip,
  onPrev,
  onNext,
}: PassCardProps) {
  const position = index + 1

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs">
            Card {position} of {total}
          </span>
          <span className="rounded-full border bg-muted px-2.5 py-0.5 font-medium text-xs">
            {order === 'shuffle' ? 'Shuffled' : 'Deck order'}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Progress through the deck"
          aria-valuenow={position}
          aria-valuemin={1}
          aria-valuemax={total}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${Math.round((position / total) * 100)}%` }}
          />
        </div>
      </div>

      <FlipCard card={card} flipped={flipped} onFlip={onFlip} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onPrev} disabled={atFirst}>
          <ChevronLeft aria-hidden="true" />
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onFlip}
          className="border-primary px-4 font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw aria-hidden="true" />
          {flipped ? 'Show the front' : 'Flip to the back'}
        </Button>

        <Button type="button" variant="outline" size="lg" onClick={onNext}>
          {atLast ? 'Finish' : 'Next'}
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
        <Hint keyName="Space">flip</Hint>
        <Hint keyName="←">back</Hint>
        <Hint keyName="→">next</Hint>
      </p>
    </div>
  )
}

function Hint({ keyName, children }: { keyName: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded-md border bg-card px-2 py-0.5 font-mono text-xs shadow-xs">
        {keyName}
      </kbd>
      {children}
    </span>
  )
}
