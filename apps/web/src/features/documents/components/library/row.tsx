import { Button } from '@fliprag/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@fliprag/ui/components/dropdown-menu'
import { ExternalLink, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { DocumentIcon } from '@/features/documents/components/document-icon'
import { DocumentProcessStatus } from '@/features/documents/components/library/process-status'
import { documentMeta } from '@/features/documents/format'
import type { SourceDocument } from '@/features/documents/types'

type DocumentRowProps = {
  document: SourceDocument
  onOpen: (document: SourceDocument) => void
  onRename: (document: SourceDocument) => void
  onDelete: (document: SourceDocument) => void
}

export function DocumentRow({ document, onOpen, onRename, onDelete }: DocumentRowProps) {
  return (
    <article className="flex items-start gap-3.5 rounded-xl border bg-card px-4 py-3.5 shadow-xs sm:items-center">
      <DocumentIcon />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <button
          type="button"
          onClick={() => onOpen(document)}
          className="cursor-pointer truncate rounded-sm text-left font-medium outline-offset-2 outline-ring hover:underline focus-visible:outline-2"
        >
          {document.name}
        </button>
        <span className="text-muted-foreground text-xs">{documentMeta(document)}</span>
        <DocumentProcessStatus document={document} />
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${document.name}`}>
              <MoreVertical aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onOpen(document)}>
              <ExternalLink aria-hidden="true" />
              Open
            </DropdownMenuItem>
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
