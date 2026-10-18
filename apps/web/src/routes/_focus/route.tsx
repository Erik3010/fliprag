import { createFileRoute, type ErrorComponentProps, Outlet } from '@tanstack/react-router'
import { requireSession } from '@/features/auth/guard'
import { CheckingSession, SessionCheckFailed } from '../-components/session-check'

// Signed-in screens that take over the whole window, with no sidebar.
export const Route = createFileRoute('/_focus')({
  beforeLoad: requireSession,
  component: Outlet,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <SessionCheckFailed error={error} className="min-h-dvh px-5" />
  ),
  pendingComponent: () => <CheckingSession className="min-h-dvh" />,
  pendingMs: 150,
  pendingMinMs: 300,
})
