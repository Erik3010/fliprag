import { Button } from '@fliprag/ui/components/button'
import { cn } from '@fliprag/ui/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { PassOrder } from '@/features/study/hooks/use-study-pass'

type PassStartProps = {
  deckTitle: string
  total: number
  order: PassOrder
  onPickOrder: (order: PassOrder) => void
  onStart: () => void
}

export function PassStart({ deckTitle, total, order, onPickOrder, onStart }: PassStartProps) {
  const options: { value: PassOrder; label: string; line: string }[] = [
    {
      value: 'deck',
      label: 'Deck order',
      line: `Card 1 to card ${total}, as they sit in the deck.`,
    },
    { value: 'shuffle', label: 'Shuffled', line: 'A fresh random order, drawn now.' },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-xs sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-balance font-semibold text-2xl tracking-tight">{deckTitle}</h1>
        <p className="text-muted-foreground text-sm">
          {total} {total === 1 ? 'card' : 'cards'}, one at a time. Front first, flip for the back.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 font-semibold text-sm">Order for this pass</legend>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((option) => {
            const active = option.value === order

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onPickOrder(option.value)}
                className={cn(
                  'flex flex-col gap-1.5 rounded-xl border bg-card px-4 py-3.5 text-left outline-offset-2 outline-ring transition-colors hover:border-ring focus-visible:outline-2',
                  active && 'border-primary ring-3 ring-accent hover:border-primary',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-4 shrink-0 rounded-full border bg-card',
                      active && 'border-4 border-primary',
                    )}
                  />
                  <span className="font-semibold text-sm">{option.label}</span>
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">{option.line}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3.5">
        <Button type="button" size="lg" onClick={onStart} className="px-5">
          Start the pass
          <ArrowRight aria-hidden="true" />
        </Button>
        <span className="text-muted-foreground text-xs">or press Enter</span>
      </div>

      <p className="border-t border-dashed pt-4 text-pretty text-muted-foreground text-xs leading-relaxed">
        Shuffling is not scheduling: nothing is remembered about which cards were hard. Leaving this
        screen ends the pass, and coming back starts the deck again from the top.
      </p>
    </div>
  )
}
