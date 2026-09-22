import { Button } from '@fliprag/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@fliprag/ui/components/dropdown-menu'
import { Check, FileText, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { documentMeta } from '@/features/documents/format'
import type { SourceDocument } from '@/features/documents/types'

type DocumentRowProps = {
  document: SourceDocument
  justRenamed: boolean
  onRename: (document: SourceDocument) => void
  onDelete: (document: SourceDocument) => void
}

export function DocumentRow({ document, justRenamed, onRename, onDelete }: DocumentRowProps) {
  return (
    <article className="flex flex-wrap items-center gap-3.5 rounded-xl border bg-card px-4 py-3.5 shadow-xs">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent"
      >
        <FileText className="size-4 text-secondary" />
      </span>

      <span className="flex min-w-0 flex-1 basis-64 flex-col gap-1">
        <span className="truncate font-medium">{document.name}</span>
        <span className="font-mono text-muted-foreground text-xs">{documentMeta(document)}</span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        {justRenamed && (
          <span className="flex items-center gap-1.5 text-primary text-xs" role="status">
            <Check className="size-3" aria-hidden="true" />
            Renamed
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${document.name}`}>
              <MoreVertical aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onRename(document)}>
              <Pencil aria-hidden="true" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(document)}>
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </article>
  )
}
