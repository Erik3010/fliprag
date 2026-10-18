import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import { useRef } from 'react'

type DeleteCardDialogProps = {
  /** 1-based position of the card being deleted, or null when the dialog is closed. */
  position: number | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteCardDialog({ position, onCancel, onConfirm }: DeleteCardDialogProps) {
  const shown = useRef(position)
  if (position !== null) {
    shown.current = position
  }

  return (
    <Dialog open={position !== null} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete card {shown.current}?</DialogTitle>
          <DialogDescription>
            Are you sure? This card will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Keep it
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
