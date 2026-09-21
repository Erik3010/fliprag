import { useCallback, useEffect, useState } from 'react'

type Health = {
  status: string
  uptime: number
}

type Probe =
  | { state: 'checking' }
  | { state: 'reachable'; health: Health }
  | { state: 'unreachable'; detail: string }

export function App() {
  const [probe, setProbe] = useState<Probe>({ state: 'checking' })

  const check = useCallback(async () => {
    setProbe({ state: 'checking' })
    try {
      const response = await fetch('/api/health')
      if (!response.ok) {
        setProbe({
          state: 'unreachable',
          detail: `The proxy reached something, but it answered ${response.status}.`,
        })
        return
      }
      setProbe({ state: 'reachable', health: (await response.json()) as Health })
    } catch (error) {
      setProbe({
        state: 'unreachable',
        detail:
          error instanceof Error ? error.message : 'The request failed before it got a reply.',
      })
    }
  }, [])

  useEffect(() => {
    void check()
  }, [check])

  return (
    <main className="page">
      <h1>fliprag</h1>
      <p className="lede">
        This page calls <code>/api/health</code> through the Vite proxy, so it shows whether the web
        app and the Hono server are both running and talking to each other.
      </p>

      <section className="probe" aria-live="polite">
        {probe.state === 'checking' && <p>Asking the server for its health...</p>}

        {probe.state === 'reachable' && (
          <p>
            The server answered <strong>{probe.health.status}</strong>,{' '}
            {Math.round(probe.health.uptime)}s after it started.
          </p>
        )}

        {probe.state === 'unreachable' && (
          <>
            <p>No usable answer from the server. {probe.detail}</p>
            <p className="muted">
              Start it in a second terminal with <code>pnpm dev:server</code>, then check again.
            </p>
          </>
        )}
      </section>

      <button type="button" onClick={() => void check()} disabled={probe.state === 'checking'}>
        Check the server again
      </button>
    </main>
  )
}
