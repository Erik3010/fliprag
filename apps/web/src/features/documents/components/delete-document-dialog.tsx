import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import type { SourceDocument } from '@/features/documents/types'

type DeleteDocumentDialogProps = {
  document: SourceDocument | null
  onCancel: () => void
  onConfirm: (id: string) => void
}

export function DeleteDocumentDialog({ document, onCancel, onConfirm }: DeleteDocumentDialogProps) {
  return (
    <Dialog open={document !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        {document && (
          <>
            <DialogHeader>
              <DialogTitle>Delete {document.name}?</DialogTitle>
              <DialogDescription>The file goes for good. This cannot be undone.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Keep it
              </Button>
              <Button type="button" variant="destructive" onClick={() => onConfirm(document.id)}>
                Delete document
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
