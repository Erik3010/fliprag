import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

type DeckListEmptyProps = {
  hasDocument: boolean
}

export function DeckListEmpty({ hasDocument }: DeckListEmptyProps) {
  const content = hasDocument
    ? {
        title: 'No decks yet',
        body: 'Make your first deck from one of your documents.',
        action: 'Create a flashcard deck',
        to: '/decks/new' as const,
      }
    : {
        title: 'No documents yet',
        body: 'A document is required to create a flashcard deck.',
        action: 'Upload a document',
        to: '/documents' as const,
      }

  return (
    <EmptyState
      icon={<FileText className="size-5 text-accent-foreground" />}
      title={content.title}
      description={content.body}
      action={
        <Button asChild size="lg">
          <Link to={content.to}>{content.action}</Link>
        </Button>
      }
    />
  )
}
