import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'

type DeleteDeckDialogProps = {
  open: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDeckDialog({ open, title, onCancel, onConfirm }: DeleteDeckDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {title.trim() ? `“${title.trim()}”` : 'this deck'}?</DialogTitle>
          <DialogDescription>
            Are you sure? This deck and its cards will be deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Keep it
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
