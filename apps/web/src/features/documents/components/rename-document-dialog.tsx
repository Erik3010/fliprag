import { Button } from '@fliprag/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fliprag/ui/components/dialog'
import { Input } from '@fliprag/ui/components/input'
import { Label } from '@fliprag/ui/components/label'
import { useEffect, useState } from 'react'
import type { SourceDocument } from '@/features/documents/types'

type RenameDocumentDialogProps = {
  document: SourceDocument | null
  onCancel: () => void
  onSave: (id: string, name: string) => void
}

export function RenameDocumentDialog({ document, onCancel, onSave }: RenameDocumentDialogProps) {
  const [name, setName] = useState('')

  // Start each opening from the document's current name rather than whatever was typed last time.
  useEffect(() => {
    if (document) {
      setName(document.name)
    }
  }, [document])

  const trimmed = name.trim()
  const unchanged = trimmed === document?.name

  return (
    <Dialog open={document !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        {document && (
          <form
            className="grid gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              if (trimmed && !unchanged) {
                onSave(document.id, trimmed)
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename document</DialogTitle>
              <DialogDescription>Enter a new name for this document.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <Label htmlFor="document-name">Name</Label>
              <Input
                id="document-name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                onFocus={(event) => event.currentTarget.select()}
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!trimmed || unchanged}>
                Save name
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
