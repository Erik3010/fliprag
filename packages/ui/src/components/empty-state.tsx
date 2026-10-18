import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  action: ReactNode
  note?: string
  className?: string
}

export function EmptyState({ icon, title, description, action, note, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/60 px-8 py-14 text-center',
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent"
        >
          {icon}
        </span>
      )}

      <p className="font-semibold text-lg tracking-tight">{title}</p>

      <p className="max-w-[42ch] text-pretty text-muted-foreground text-sm">{description}</p>

      <div className="mt-2">{action}</div>

      {note && <p className="text-muted-foreground text-xs">{note}</p>}
    </div>
  )
}
