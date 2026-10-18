import { Button } from '@fliprag/ui/components/button'
import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import { Loader2, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { requireSession } from '@/features/auth/guard'
import { failureMessage } from '@/lib/http'
import { AppSidebar } from './-components/app-sidebar'

export const Route = createFileRoute('/_app')({
  beforeLoad: requireSession,
  component: AppLayout,
  errorComponent: SessionCheckFailed,
  pendingComponent: CheckingSession,
  // Under 150 ms nobody sees a blank; past it the layout shows, and stays long enough not to blink.
  pendingMs: 150,
  pendingMinMs: 300,
})

function AppLayout() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  )
}

// Shown while /me is in flight on a page load. The sidebar comes up at once so the page has its
// shape; only the screen waits.
function CheckingSession() {
  return (
    <PageLayout>
      <div
        role="status"
        className="flex min-h-[calc(100dvh-5rem)] items-center justify-center gap-2.5 text-muted-foreground text-sm"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Checking your sign-in
      </div>
    </PageLayout>
  )
}

function SessionCheckFailed({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <PageLayout>
      <div
        role="alert"
        className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center gap-3 text-center"
      >
        <p className="font-medium text-sm">Your sign-in could not be checked</p>
        <p className="max-w-[42ch] text-pretty text-muted-foreground text-xs">
          {failureMessage(error)}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => router.invalidate()}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </PageLayout>
  )
}

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />

      <div className="flex-1">
        <main className="mx-auto w-full max-w-3xl px-6 py-10">{children}</main>
      </div>
    </div>
  )
}
