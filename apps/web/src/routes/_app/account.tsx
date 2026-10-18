import { Button } from '@fliprag/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useSignOut } from '@/features/auth/hooks/use-sign-out'
import { useAuthStore } from '@/store/auth'

export const Route = createFileRoute('/_app/account')({
  component: Account,
})

function Account() {
  const user = useAuthStore((state) => state.user)
  const signOut = useSignOut()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl tracking-tight">Account</h1>
        <p className="text-muted-foreground text-sm">
          Changing the email or password comes in a later phase.
        </p>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-5 rounded-xl border bg-card p-5 shadow-xs">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="truncate font-medium">{user?.email}</span>
        </div>

        <Button type="button" variant="outline" onClick={signOut}>
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </section>
    </div>
  )
}
