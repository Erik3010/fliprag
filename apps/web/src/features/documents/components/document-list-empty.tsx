import { Button } from '@fliprag/ui/components/button'
import { Upload } from 'lucide-react'

type DocumentListEmptyProps = {
  onPick: () => void
}

export function DocumentListEmpty({ onPick }: DocumentListEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-accent">
        <Upload className="size-5 text-accent-foreground" />
      </span>

      <p className="font-semibold text-lg tracking-tight">No documents yet</p>
      <p className="max-w-md text-pretty text-muted-foreground text-sm">
        Upload the your PDF documents here to start creating flashcard decks
      </p>

      <Button type="button" size="lg" onClick={onPick} className="mt-2">
        Upload your first PDF
      </Button>
      <p className="text-muted-foreground text-xs">or drop a file in this area</p>
    </div>
  )
}
