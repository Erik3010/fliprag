import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import { useNavigate } from '@tanstack/react-router'

type UploadPromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadPromptDialog({ open, onOpenChange }: UploadPromptDialogProps) {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document first</DialogTitle>
          <DialogDescription>A document is required to create a flashcard deck.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={() => navigate({ to: '/documents' })}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
