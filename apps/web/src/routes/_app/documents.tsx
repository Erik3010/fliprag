import { Button } from '@fliprag/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { DeleteDocumentDialog } from '@/features/documents/components/library/delete-dialog'
import { DocumentList } from '@/features/documents/components/library/list'
import { DocumentListEmpty } from '@/features/documents/components/library/list-empty'
import { RenameDocumentDialog } from '@/features/documents/components/library/rename-dialog'
import { UploadProgress } from '@/features/documents/components/library/upload-progress'
import { useDocumentLibrary } from '@/features/documents/hooks/use-document-library'
import type { SourceDocument } from '@/features/documents/types'

export const Route = createFileRoute('/_app/documents')({
  head: () => ({ meta: [{ title: 'Documents' }] }),
  component: Documents,
})

function Documents() {
  const library = useDocumentLibrary()
  const [toDelete, setToDelete] = useState<SourceDocument | null>(null)
  const [toRename, setToRename] = useState<SourceDocument | null>(null)

  // No accept or maxSize here, so a wrong file reaches library.start() and gets a message
  // instead of being dropped silently.
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop: (accepted, rejected) => {
      const file = accepted[0] ?? rejected[0]?.file
      if (file) {
        library.start(file)
      }
    },
  })

  const documents = library.documents ?? []

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm">
            Upload and manage the PDFs used to generate your decks.
          </p>
        </div>

        <Button type="button" onClick={open}>
          <Upload aria-hidden="true" />
          Upload document
        </Button>
      </header>

      <section
        {...getRootProps()}
        className={`-m-2.5 flex flex-col gap-2.5 rounded-2xl p-2.5 transition-colors ${
          isDragActive ? 'bg-accent/60 inset-ring-2 inset-ring-primary' : ''
        }`}
      >
        <input {...getInputProps({ accept: 'application/pdf,.pdf' })} />

        {library.upload && <UploadProgress upload={library.upload} onCancel={library.cancel} />}

        <DocumentList
          documents={documents}
          loading={library.loading}
          error={library.error}
          empty={!library.upload && <DocumentListEmpty onPick={open} />}
          onRetry={library.retry}
          onOpen={(doc) => library.open(doc.id)}
          onRename={setToRename}
          onDelete={setToDelete}
        />

        {documents.length > 0 && (
          <button
            type="button"
            onClick={open}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-muted-foreground text-sm outline-offset-2 outline-ring hover:border-ring hover:text-foreground focus-visible:outline-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            Drop a document here, or choose a file
          </button>
        )}
      </section>

      <RenameDocumentDialog
        document={toRename}
        onCancel={() => setToRename(null)}
        onSave={(id, name) => {
          library.rename(id, name)
          setToRename(null)
        }}
      />

      <DeleteDocumentDialog
        document={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={(id) => {
          library.remove(id)
          setToDelete(null)
        }}
      />
    </div>
  )
}
