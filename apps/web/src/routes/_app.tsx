import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireSession } from '@/features/auth/guard'
import { AppSidebar } from './-components/app-sidebar'

export const Route = createFileRoute('/_app')({
  beforeLoad: requireSession,
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />

      <div className="flex-1">
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
