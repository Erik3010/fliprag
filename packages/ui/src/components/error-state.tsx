import { RefreshCw } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

type ErrorStateProps = {
  title: string
  detail?: string
  onRetry: () => void
  className?: string
}

export function ErrorState({ title, detail, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/40 bg-card px-4 py-3.5',
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="font-medium text-sm">{title}</span>
        {detail && <span className="text-muted-foreground text-xs">{detail}</span>}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}
