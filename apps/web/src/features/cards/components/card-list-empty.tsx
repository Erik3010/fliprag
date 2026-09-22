import { Button } from '@fliprag/ui/components/button'
import { Plus } from 'lucide-react'
import { DeckMark } from '@/features/decks/components/deck-mark'

type CardListEmptyProps = {
  onAdd: () => void
}

export function CardListEmpty({ onAdd }: CardListEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent">
        <DeckMark />
      </span>

      <p className="font-semibold text-lg tracking-tight">No cards in this deck</p>

      <p className="max-w-[42ch] text-pretty text-muted-foreground text-sm">
        Write the first one by hand: a question on the front, the answer on the back.
      </p>

      <Button type="button" size="lg" onClick={onAdd} className="mt-2 px-5">
        <Plus aria-hidden="true" />
        Write the first card
      </Button>
    </div>
  )
}
