import { Tooltip, TooltipContent, TooltipTrigger } from '@fliprag/ui/components/tooltip'
import { Loader2 } from 'lucide-react'
import type { SourceDocument } from '@/features/documents/types'

const badge =
  'w-fit rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive text-xs'

type DocumentStatusProps = {
  document: SourceDocument
  /** Shows the failure reason in a tooltip. Not inside another button, which cannot hold one. */
  showReason?: boolean
}

export function DocumentStatus({ document, showReason = false }: DocumentStatusProps) {
  if (document.status === 'processing') {
    return (
      <span role="status" className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
        Reading
      </span>
    )
  }

  if (document.status !== 'failed') {
    return null
  }

  if (!showReason) {
    return <span className={badge}>Failed to process</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`${badge} cursor-default outline-offset-2 outline-ring focus-visible:outline-2`}
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
