import { Button } from '@fliprag/ui/components/button'
import { cn } from '@fliprag/ui/lib/utils'
import { FilePlus } from 'lucide-react'
import { DocumentIcon } from '@/features/documents/components/document-icon'
import { documentMeta } from '@/features/documents/format'
import type { SourceDocument } from '@/features/documents/types'

const browse = 'shrink-0 border-accent-foreground/40 text-accent-foreground'

type SourceDocumentFieldProps = {
  document?: SourceDocument
  errorId?: string
  onBrowse: () => void
}

export function SourceDocumentField({ document, errorId, onBrowse }: SourceDocumentFieldProps) {
  if (document) {
    return (
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <DocumentIcon />

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-medium text-sm">{document.name}</span>
          <span className="text-muted-foreground text-xs">{documentMeta(document)}</span>
        </span>

        <Button type="button" variant="outline" onClick={onBrowse} className={browse}>
          Change
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border p-4',
        errorId && 'border-destructive',
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-lg border bg-card"
      >
        <FilePlus className="size-4 text-muted-foreground" />
      </span>

      <span className="flex min-w-0 flex-1 basis-56 flex-col gap-0.5">
        <span className="font-semibold text-sm">Which document is this deck from?</span>
        <span className="text-pretty text-muted-foreground text-xs leading-relaxed">
          Cards are written from this one document. It can't be swapped after the deck is made.
        </span>
      </span>

      <Button
        type="button"
        variant="outline"
        onClick={onBrowse}
        aria-describedby={errorId}
        className={browse}
      >
        Browse documents
      </Button>
    </div>
  )
}
