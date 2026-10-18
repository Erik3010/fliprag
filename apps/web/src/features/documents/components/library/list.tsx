import { ErrorState } from '@fliprag/ui/components/error-state'
import type { ReactNode } from 'react'
import { DocumentRow } from '@/features/documents/components/library/row'
import type { SourceDocument } from '@/features/documents/types'

type DocumentListProps = {
  documents: SourceDocument[]
  loading: boolean
  error?: string
  empty: ReactNode
  onRetry: () => void
  onOpen: (document: SourceDocument) => void
  onRename: (document: SourceDocument) => void
  onDelete: (document: SourceDocument) => void
}

export function DocumentList({
  documents,
  loading,
  error,
  empty,
  onRetry,
  onOpen,
  onRename,
  onDelete,
}: DocumentListProps) {
  return (
    <>
      {loading && <LoadingRows />}

      {error && (
        <ErrorState title="Documents could not be loaded" detail={error} onRetry={onRetry} />
      )}

      {documents.map((document) => (
        <DocumentRow
          key={document.id}
          document={document}
          onOpen={onOpen}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}

      {!loading && !error && documents.length === 0 && empty}
    </>
  )
}

function LoadingRows() {
  return (
    <output aria-label="Loading documents" className="flex flex-col gap-2.5">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3.5 rounded-xl border bg-card px-4 py-3.5">
          <span className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <span className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </span>
        </div>
      ))}
    </output>
  )
}
