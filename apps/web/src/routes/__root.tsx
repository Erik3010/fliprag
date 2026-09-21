import { createRootRoute, Outlet } from '@tanstack/react-router'
import { type ComponentType, lazy, Suspense } from 'react'

type DevtoolsProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const Devtools: ComponentType<DevtoolsProps> = import.meta.env.DEV
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
        <Devtools position="bottom-right" />
      </Suspense>
    </>
  )
}
