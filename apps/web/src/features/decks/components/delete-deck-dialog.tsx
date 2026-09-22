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
  cardCount: number
  documentName: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDeckDialog({
  open,
  title,
  cardCount,
  documentName,
  onCancel,
  onConfirm,
}: DeleteDeckDialogProps) {
  const name = title.trim() || 'This deck'
  const cards = cardCount === 1 ? 'its card' : `its ${cardCount} cards`

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this deck?</DialogTitle>
          <DialogDescription>
            {cardCount > 0 ? `“${name}” and ${cards} go for good.` : `“${name}” goes for good.`}{' '}
            {documentName} stays in your documents.
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
