import { useCallback, useEffect, useState } from 'react'

type Health = {
  status: string
  uptime: number
}

type Probe =
  | { state: 'checking' }
  | { state: 'reachable'; health: Health }
  | { state: 'unreachable'; detail: string }

const code = 'rounded bg-neutral-100 px-1 py-0.5 font-mono text-sm dark:bg-neutral-800'

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
    <main className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">fliprag</h1>

      <p className="mt-3 mb-8 text-neutral-600 dark:text-neutral-400">
        This page calls <code className={code}>/api/health</code> through the Vite proxy, so it
        shows whether the web app and the Hono server are both running and talking to each other.
      </p>

      <section
        aria-live="polite"
        className="mb-6 rounded-md border border-neutral-200 px-4 py-4 dark:border-neutral-800"
      >
        {probe.state === 'checking' && <p>Asking the server for its health...</p>}

        {probe.state === 'reachable' && (
          <p>
            The server answered <strong className="font-semibold">{probe.health.status}</strong>,{' '}
            {Math.round(probe.health.uptime)}s after it started.
          </p>
        )}

        {probe.state === 'unreachable' && (
          <>
            <p>No usable answer from the server. {probe.detail}</p>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Start it in a second terminal with <code className={code}>pnpm dev:server</code>, then
              check again.
            </p>
          </>
        )}
      </section>

      <button
        type="button"
        onClick={() => void check()}
        disabled={probe.state === 'checking'}
        className="min-h-11 rounded-md bg-orange-800 px-5 text-white outline-offset-2 outline-orange-800 hover:bg-orange-900 focus-visible:outline-2 disabled:bg-neutral-200 disabled:text-neutral-600 dark:bg-orange-400 dark:text-neutral-950 dark:outline-orange-400 dark:hover:bg-orange-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400"
      >
        Check the server again
      </button>
    </main>
  )
}
