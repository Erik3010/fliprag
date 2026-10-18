import { Button } from '@fliprag/ui/components/button'
import { cn } from '@fliprag/ui/lib/utils'
import { type ErrorComponentProps, useRouter } from '@tanstack/react-router'
import { Loader2, LogOut, RefreshCw } from 'lucide-react'
import { useSignOut } from '@/features/auth/hooks/use-sign-out'
import { failureMessage } from '@/lib/http'

export function CheckingSession({ className }: { className?: string }) {
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

export function SessionCheckFailed({
  error,
  className,
}: Pick<ErrorComponentProps, 'error'> & { className?: string }) {
  const router = useRouter()
  const signOut = useSignOut()

  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center gap-3 text-center', className)}
    >
      <p className="font-medium text-sm">Your credentials could not be checked</p>
      <p className="max-w-[42ch] text-pretty text-muted-foreground text-xs">
        {failureMessage(error)}
      </p>
      <div className="flex flex-col items-stretch gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => router.invalidate()}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={signOut}>
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
