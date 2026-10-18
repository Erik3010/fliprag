import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Link } from '@tanstack/react-router'

export function DeckNotFound({ className }: { className?: string }) {
  return (
    <EmptyState
      title="There is no deck here"
      description="This deck was deleted or the link is invalid."
      action={
        <Button asChild size="lg">
          <Link to="/">All decks</Link>
        </Button>
      }
      className={className}
    />
  )
}
