import { DocumentIcon } from '@/features/documents/components/document-icon'

type DeckSourceProps = {
  documentName: string
  onOpen: () => void
}

export function DeckSource({ documentName, onOpen }: DeckSourceProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left shadow-xs outline-offset-2 outline-ring transition-colors hover:border-ring focus-visible:outline-2"
    >
      <DocumentIcon />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-muted-foreground text-xs">Source document</span>
        <span className="truncate font-medium text-sm">{documentName}</span>
      </span>

      <span className="shrink-0 font-semibold text-primary text-xs">Open</span>
    </button>
  )
}
