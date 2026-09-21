import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Devtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <Suspense>
        <Devtools />
      </Suspense>
    </>
  )
}
