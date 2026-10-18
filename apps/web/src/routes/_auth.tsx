import { createFileRoute, Outlet } from '@tanstack/react-router'
import { redirectIfSignedIn } from '@/features/auth/guard'

export const Route = createFileRoute('/_auth')({
  beforeLoad: redirectIfSignedIn,
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-serif text-3xl tracking-tight">fliprag</p>
        <Outlet />
      </div>
    </main>
  )
}
