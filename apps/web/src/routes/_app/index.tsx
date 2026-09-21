import { Button } from '@fliprag/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'
import { useServerHealth } from '@/features/health/hooks/use-server-health'

export const Route = createFileRoute('/_app/')({
  component: HealthCheck,
})

const code = 'rounded bg-muted px-1 py-0.5 font-mono text-sm'

function HealthCheck() {
  const { probe, check } = useServerHealth()

  return (
    <>
      <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">fliprag</h1>

      <p className="mt-3 mb-8 max-w-lg text-pretty text-muted-foreground">
        This page calls <code className={code}>/api/health</code> through the Vite proxy, so it
        shows whether the web app and the Hono server are both running and talking to each other.
      </p>

      <section aria-live="polite" className="mb-6 rounded-lg border px-4 py-4">
        {probe.state === 'checking' && <p>Asking the server for its health...</p>}

        {probe.state === 'reachable' && (
          <p>
            The server answered <strong className="font-semibold">{probe.health.status}</strong>,{' '}
            <span className="tabular-nums">{Math.round(probe.health.uptime)}s</span> after it
            started.
          </p>
        )}

        {probe.state === 'unreachable' && (
          <>
            <p>No usable answer from the server. {probe.detail}</p>
            <p className="mt-2 text-muted-foreground">
              Start it in a second terminal with <code className={code}>pnpm dev:server</code>, then
              check again.
            </p>
          </>
        )}
      </section>

      <Button
        type="button"
        onClick={() => void check()}
        disabled={probe.state === 'checking'}
        className="min-h-11"
      >
        Check the server again
      </Button>
    </>
  )
}
