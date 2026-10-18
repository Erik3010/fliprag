import { Button } from '@fliprag/ui/components/button'
import { EmptyState } from '@fliprag/ui/components/empty-state'
import { Upload } from 'lucide-react'

type DocumentListEmptyProps = {
  onPick: () => void
}

export function DocumentListEmpty({ onPick }: DocumentListEmptyProps) {
  return (
    <EmptyState
      icon={<Upload className="size-5 text-accent-foreground" />}
      title="No documents yet"
      description="Upload the your PDF documents here to start creating flashcard decks"
      action={
        <Button type="button" size="lg" onClick={onPick} className="px-5">
          Upload your first document
        </Button>
      }
      note="or drop a file in this area"
    />
  )
}
