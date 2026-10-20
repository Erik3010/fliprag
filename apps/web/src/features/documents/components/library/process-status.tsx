import { Tooltip, TooltipContent, TooltipTrigger } from '@fliprag/ui/components/tooltip'
import { Loader2 } from 'lucide-react'
import type { SourceDocument } from '@/features/documents/types'

type DocumentProcessStatusProps = {
  document: SourceDocument
}

export function DocumentProcessStatus({ document }: DocumentProcessStatusProps) {
  if (document.status === 'processing') {
    return (
      <span role="status" className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
        Reading
      </span>
    )
  }

  if (document.status === 'failed') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="w-fit cursor-default rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive text-xs outline-offset-2 outline-ring focus-visible:outline-2"
          >
            Failed to process
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {document.processError ?? 'Something went wrong.'}
        </TooltipContent>
      </Tooltip>
    )
  }

  return null
}
