import { Button } from '@fliprag/ui/components/button'
import { FieldError } from '@fliprag/ui/components/field-error'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Upload } from 'lucide-react'
import { type DragEvent, useRef, useState } from 'react'
import { DeleteDocumentDialog } from '@/features/documents/components/delete-document-dialog'
import { DocumentRow } from '@/features/documents/components/document-row'
import { RenameDocumentDialog } from '@/features/documents/components/rename-document-dialog'
import { UploadProgress } from '@/features/documents/components/upload-progress'
import { useDocumentLibrary } from '@/features/documents/hooks/use-document-library'
import type { SourceDocument } from '@/features/documents/types'

export const Route = createFileRoute('/_app/documents')({
  component: Documents,
})

function Documents() {
  const library = useDocumentLibrary()
  const [dragging, setDragging] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<SourceDocument | null>(null)
  const [renaming, setRenaming] = useState<SourceDocument | null>(null)
  const [justRenamedId, setJustRenamedId] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const { documents, upload } = library
  const isEmpty = documents.length === 0 && !upload

  function take(files: FileList | null) {
    const file = files?.[0]
    if (file) {
      library.start(file)
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    take(event.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm">
            {documents.length === 0
              ? 'A deck is always made from one document.'
              : `${documents.length} ${documents.length === 1 ? 'document' : 'documents'}, and every deck is made from one of these`}
          </p>
        </div>

        <Button type="button" onClick={() => fileInput.current?.click()}>
          <Upload aria-hidden="true" />
          Upload PDF
        </Button>
      </header>

      <input
        ref={fileInput}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => {
          take(event.currentTarget.files)
          event.currentTarget.value = ''
        }}
      />

      <FieldError message={library.rejected ?? undefined} />

      {/* biome-ignore lint/a11y/noStaticElementInteractions: the drop target is a convenience,
          every action inside it is reachable from the Upload button and the row menus */}
      <section
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`-m-2.5 flex flex-col gap-2.5 rounded-2xl p-2.5 transition-colors ${
          dragging ? 'bg-accent/60 inset-ring-2 inset-ring-primary' : ''
        }`}
      >
        {upload && <UploadProgress upload={upload} onCancel={library.cancel} />}

        {documents.map((document) => (
          <DocumentRow
            key={document.id}
            document={document}
            justRenamed={document.id === justRenamedId}
            onRename={setRenaming}
            onDelete={setPendingDelete}
          />
        ))}

        {isEmpty && <NoDocumentsYet onPick={() => fileInput.current?.click()} />}

        {documents.length > 0 && (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-muted-foreground text-sm outline-offset-2 outline-ring hover:border-ring hover:text-foreground focus-visible:outline-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            Drop a PDF here, or choose a file
          </button>
        )}
      </section>

      <RenameDocumentDialog
        document={renaming}
        onCancel={() => setRenaming(null)}
        onSave={(id, name) => {
          library.rename(id, name)
          setRenaming(null)
          setJustRenamedId(id)
        }}
      />

      <DeleteDocumentDialog
        document={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={(id) => {
          library.remove(id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}

function NoDocumentsYet({ onPick }: { onPick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl bg-accent">
        <Upload className="size-5 text-accent-foreground" />
      </span>

      <p className="font-semibold text-lg tracking-tight">No documents yet</p>
      <p className="max-w-md text-pretty text-muted-foreground text-sm">
        Upload the lecture, chapter, or paper you want to study. Every deck is made from one of
        these.
      </p>

      <Button type="button" size="lg" onClick={onPick} className="mt-2">
        Upload your first PDF
      </Button>
      <p className="text-muted-foreground text-xs">or drop a file anywhere in this panel</p>
    </div>
  )
}
