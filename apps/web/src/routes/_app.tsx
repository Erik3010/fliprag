import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from './-components/app-sidebar'

export const Route = createFileRoute('/_app')({
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
