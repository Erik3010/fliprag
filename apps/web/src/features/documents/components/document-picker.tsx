import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import { cn } from '@fliprag/ui/lib/utils'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DocumentStatus } from '@/features/documents/components/document-status'
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
  const [highlighted, setHighlighted] = useState(selectedId)

  // Each opening starts from the current choice, not from a row clicked and then cancelled.
  useEffect(() => {
    if (open) {
      setHighlighted(selectedId)
    }
  }, [open, selectedId])

  const chosen = documents.find((doc) => doc.id === highlighted)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="flex-row items-start justify-between gap-4 border-b p-5">
          <span className="flex flex-col gap-1">
            <DialogTitle>Choose a document</DialogTitle>
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
            const active = doc.id === highlighted
            // A deck needs a ready document; the rest stay listed so they do not seem lost.
            const unavailable = doc.status !== 'ready'

            return (
              <button
                key={doc.id}
                type="button"
                aria-pressed={active}
                disabled={unavailable}
                onClick={() => setHighlighted(doc.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-left outline-offset-2 outline-ring transition-colors focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60',
                  active
                    ? 'border-primary bg-accent/55'
                    : 'enabled:hover:border-ring enabled:hover:bg-muted/50',
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
                  <span className="text-muted-foreground text-xs">{documentMeta(doc)}</span>
                  <DocumentStatus document={doc} />
                </span>
              </button>
            )
          })}
        </div>

        <DialogFooter className="border-t px-5 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" disabled={!chosen} onClick={() => chosen && onSelect(chosen)}>
            Choose document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
