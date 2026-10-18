import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Link } from '@tanstack/react-router'

export function DeckNotFound({ className }: { className?: string }) {
  return (
    <EmptyState
      title="There is no deck here"
      description="It may have been deleted, or the link may be wrong. Your decks are all on the home screen."
      action={
        <Button asChild size="lg" className="px-5">
          <Link to="/">All decks</Link>
        </Button>
      }
      className={className}
    />
  )
}
