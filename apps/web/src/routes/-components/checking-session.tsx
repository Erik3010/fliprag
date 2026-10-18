import { cn } from '@fliprag/ui/lib/utils'
import { Loader2 } from 'lucide-react'

type CheckingSessionProps = {
  className?: string
}

export function CheckingSession({ className }: CheckingSessionProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-2.5 text-muted-foreground text-sm',
        className,
      )}
    >
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      Checking your sign-in
    </div>
  )
}
