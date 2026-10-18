import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Plus } from 'lucide-react'
import { DeckMark } from '@/features/decks/components/deck-mark'

type CardListEmptyProps = {
  onAdd: () => void
}

export function CardListEmpty({ onAdd }: CardListEmptyProps) {
  return (
    <EmptyState
      icon={<DeckMark />}
      title="No cards in this deck"
      description="Write the first one by hand: a question on the front, the answer on the back."
      action={
        <Button type="button" size="lg" onClick={onAdd} className="px-5">
          <Plus aria-hidden="true" />
          Write the first card
        </Button>
      }
    />
  )
}
