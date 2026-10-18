import { createFileRoute, type ErrorComponentProps, Outlet } from '@tanstack/react-router'
import { requireSession } from '@/features/auth/guard'
import { CheckingSession } from '../-components/checking-session'
import { SessionCheckFailed } from '../-components/session-check-failed'

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
