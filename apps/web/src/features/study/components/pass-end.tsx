import { Button } from '@fliprag/ui/components/button'
import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { PassOrder } from '@/features/study/hooks/use-study-pass'

type PassEndProps = {
  deckId: string
  total: number
  order: PassOrder
  onAgain: (order: PassOrder) => void
}

export function PassEnd({ deckId, total, order, onAgain }: PassEndProps) {
  const shuffled = order === 'shuffle'
  const other: PassOrder = shuffled ? 'deck' : 'shuffle'
  const again = useRef<HTMLButtonElement>(null)

  // Finish was pressed on a button that is now gone, so focus moves to the next thing to press.
  useEffect(() => {
    again.current?.focus()
  }, [])

  return (
    <div className="flex flex-col items-center gap-3.5 rounded-2xl border bg-card px-6 py-9 text-center shadow-xs sm:px-8">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-accent">
        <Check className="size-5 text-accent-foreground" strokeWidth={2.25} />
      </span>

      <h1 className="font-semibold text-2xl tracking-tight">End of the deck</h1>

      <p className="max-w-[42ch] text-pretty text-muted-foreground text-sm">
        You went through all {total} cards{' '}
        {shuffled ? 'in a shuffled order' : "in the deck's order"}. Nothing was recorded about which
        ones were hard, so another pass starts clean.
      </p>

      <div className="flex flex-wrap justify-center gap-2.5 pt-2">
        <Button ref={again} type="button" size="lg" onClick={() => onAgain(order)} className="px-5">
          {shuffled ? 'Go again, shuffled' : 'Go again, deck order'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => onAgain(other)}>
          {shuffled ? 'Go again in deck order' : 'Go again, shuffled'}
        </Button>
      </div>

      <Link
        to="/decks/$deckId"
        params={{ deckId }}
        className="mt-1.5 rounded-sm font-medium text-primary text-sm outline-offset-2 outline-ring hover:text-accent-foreground focus-visible:outline-2"
      >
        Back to the deck
      </Link>
    </div>
  )
}
