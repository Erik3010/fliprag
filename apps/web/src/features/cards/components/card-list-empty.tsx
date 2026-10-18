import { BrandMark } from '@fliprag/ui/components/brand-mark'
import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Plus } from 'lucide-react'

type CardListEmptyProps = {
  onAdd: () => void
}

export function CardListEmpty({ onAdd }: CardListEmptyProps) {
  return (
    <EmptyState
      icon={<BrandMark />}
      title="No cards in this deck"
      description="Add a card with a question on the front and the answer on the back."
      action={
        <Button type="button" size="lg" onClick={onAdd}>
          <Plus aria-hidden="true" />
          Write the first card
        </Button>
      }
    />
  )
}
