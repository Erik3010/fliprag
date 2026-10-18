import { Button } from '@fliprag/ui/components/button'
import { ChoiceCard, ChoiceGroup } from '@fliprag/ui/components/choice-group'
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
  const options: { value: PassOrder; label: string; description: string }[] = [
    {
      value: 'deck',
      label: 'Deck order',
      description: 'The cards in the order they are in the deck.',
    },
    { value: 'shuffle', label: 'Shuffled', description: 'The cards in a random order.' },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-xs sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-balance font-semibold text-2xl tracking-tight">{deckTitle}</h1>
        <p className="text-muted-foreground text-sm">
          {total} {total === 1 ? 'card' : 'cards'} in this deck. Use Space to flip and the arrow
          keys to move between cards.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p id="card-order-label" className="font-semibold text-sm">
          Choose the card order
        </p>

        <ChoiceGroup
          aria-labelledby="card-order-label"
          value={order}
          onValueChange={(value) => onPickOrder(value as PassOrder)}
          className="sm:grid-cols-2"
        >
          {options.map((option) => (
            <ChoiceCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
            />
          ))}
        </ChoiceGroup>
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        <Button type="button" size="lg" onClick={onStart}>
          Start studying
          <ArrowRight aria-hidden="true" />
        </Button>
        <span className="text-muted-foreground text-xs">or press Enter</span>
      </div>
    </div>
  )
}
