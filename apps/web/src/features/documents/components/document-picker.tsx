import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import { cn } from '@fliprag/ui/lib/utils'
import { Check, X } from 'lucide-react'
import { documentMeta } from '@/features/documents/format'
import type { SourceDocument } from '@/features/documents/types'

type DocumentPickerProps = {
  documents: SourceDocument[]
  selectedId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (document: SourceDocument) => void
}

export function DocumentPicker({
  documents,
  selectedId,
  open,
  onOpenChange,
  onSelect,
}: DocumentPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The close button is laid out in the header rather than positioned over the corner, so it
          lines up with the title instead of sitting on its own inset. */}
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-start justify-between gap-4 border-b p-5">
          <span className="flex flex-col gap-1">
            <DialogTitle className="text-base">Choose a document</DialogTitle>
            <DialogDescription>
              {documents.length} document{documents.length === 1 ? '' : 's'} uploaded
            </DialogDescription>
          </span>

          <DialogClose asChild>
            <Button type="button" variant="ghost" size="icon-sm" className="-mr-2 shrink-0">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-5 pt-4 pb-5">
          {documents.map((doc) => {
            const active = doc.id === selectedId

            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onSelect(doc)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-3.5 text-left outline-offset-2 outline-ring transition-colors focus-visible:outline-2',
                  active ? 'border-primary bg-accent/55' : 'hover:border-ring hover:bg-muted/50',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-full border',
                    active ? 'border-primary bg-primary' : 'bg-card',
                  )}
                >
                  <Check className={cn('size-3 text-primary-foreground', !active && 'opacity-0')} />
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-medium text-sm">{doc.name}</span>
                  <span className="font-mono text-muted-foreground text-xs">
                    {documentMeta(doc)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
