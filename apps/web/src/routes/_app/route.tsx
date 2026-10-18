import { createFileRoute, type ErrorComponentProps, Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { requireSession } from '@/features/auth/guard'
import { AppSidebar } from '../-components/app-sidebar'
import { CheckingSession } from '../-components/checking-session'
import { SessionCheckFailed } from '../-components/session-check-failed'

export const Route = createFileRoute('/_app')({
  beforeLoad: requireSession,
  component: AppLayout,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <PageLayout>
      <SessionCheckFailed error={error} className="min-h-[calc(100dvh-5rem)]" />
    </PageLayout>
  ),
  // The sidebar comes up at once so the page has its shape; only the screen waits.
  pendingComponent: () => (
    <PageLayout>
      <CheckingSession className="min-h-[calc(100dvh-5rem)]" />
    </PageLayout>
  ),
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

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
