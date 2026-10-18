import { cn } from '../lib/utils'

// apps/web/public/favicon.svg draws this same mark in hex. Change one, change the other.
export function BrandMark({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('flex w-8 flex-col gap-1 pt-0.5', className)}>
      <span className="h-1 rounded-xs bg-primary" />
      <span className="h-1 w-4/5 rounded-xs bg-ring" />
      <span className="h-1 w-3/5 rounded-xs bg-border" />
    </span>
  )
}
