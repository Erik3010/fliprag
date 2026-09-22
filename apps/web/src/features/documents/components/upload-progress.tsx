import { Button } from '@fliprag/ui/components/button'
import { Loader2 } from 'lucide-react'
import { documentSize } from '@/features/documents/format'
import type { PendingUpload } from '@/features/documents/types'

type UploadProgressProps = {
  upload: PendingUpload
  onCancel: () => void
}

export function UploadProgress({ upload, onCancel }: UploadProgressProps) {
  const percent = Math.min(99, Math.round(upload.progress))

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ring bg-card px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent"
        >
          <Loader2 className="size-4 animate-spin text-primary" />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-medium">{upload.name}</span>
          <span className="font-mono text-muted-foreground text-xs">
            {documentSize(upload.sizeBytes)} · {percent}% · not sent to a server yet
          </span>
        </span>

        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div
        role="progressbar"
        aria-label={`Uploading ${upload.name}`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${Math.min(100, upload.progress)}%` }}
        />
      </div>
    </div>
  )
}
