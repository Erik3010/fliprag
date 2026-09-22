import { cn } from '@fliprag/ui/lib/utils'
import { useEffect, useRef } from 'react'
import type { Card } from '@/features/cards/types'

type FlipCardProps = {
  card: Card
  flipped: boolean
  onFlip: () => void
}

const face =
  'absolute inset-0 flex flex-col gap-4 rounded-2xl border p-6 shadow-lg backface-hidden sm:p-7'

// The whole card is the flip button. Both faces are in the DOM so the turn can be drawn; the one
// facing away is hidden from assistive tech so only the visible side is read.
export function FlipCard({ card, flipped, onFlip }: FlipCardProps) {
  const button = useRef<HTMLButtonElement>(null)

  // The pass starts here, so focus lands here rather than on the Start button that just went.
  useEffect(() => {
    button.current?.focus()
  }, [])

  return (
    <button
      ref={button}
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      className="relative block h-80 w-full cursor-pointer rounded-2xl text-left outline-offset-4 outline-ring perspective-distant focus-visible:outline-2 sm:h-84"
    >
      <span
        className={cn(
          'absolute inset-0 transform-3d transition-transform duration-500 ease-out motion-reduce:transition-none',
          flipped && 'rotate-y-180',
        )}
      >
        <span aria-hidden={flipped} className={cn(face, 'bg-card')}>
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Front
          </span>
          <span className="flex min-h-0 flex-1 items-center overflow-auto text-pretty font-medium text-xl leading-snug tracking-tight sm:text-2xl">
            {card.front.trim() || 'This card has no front yet.'}
          </span>
          <span className="text-muted-foreground text-xs">Space flips the card</span>
        </span>

        <span aria-hidden={!flipped} className={cn(face, 'rotate-y-180 border-ring bg-accent')}>
          <span className="font-mono text-accent-foreground text-xs uppercase tracking-widest">
            Back
          </span>
          <span className="flex min-h-0 flex-1 items-center overflow-auto text-pretty text-lg leading-relaxed sm:text-xl">
            {card.back.trim() || 'This card has no back yet.'}
          </span>
          <span className="text-accent-foreground text-xs">Right arrow for the next card</span>
        </span>
      </span>
    </button>
  )
}
