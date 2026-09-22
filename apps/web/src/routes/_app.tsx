import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { requireSession } from '@/features/auth/guard'
import { AppSidebar } from './-components/app-sidebar'

export const Route = createFileRoute('/_app')({
  beforeLoad: requireSession,
  component: AppLayout,
  pendingComponent: CheckingSession,
  // Under 150 ms nobody sees a blank; past it the frame shows, and stays long enough not to blink.
  pendingMs: 150,
  pendingMinMs: 300,
})

function AppLayout() {
  return (
    <Frame>
      <Outlet />
    </Frame>
  )
}

// Shown while /me is in flight on a page load. The sidebar comes up at once so the page has its
// shape; only the screen waits.
function CheckingSession() {
  return (
    <Frame>
      <div
        role="status"
        className="flex min-h-[calc(100dvh-5rem)] items-center justify-center gap-2.5 text-muted-foreground text-sm"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Checking your sign-in
      </div>
    </Frame>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />

      <div className="flex-1">
        <main className="mx-auto w-full max-w-3xl px-6 py-10">{children}</main>
      </div>
    </div>
  )
}
