import { serve } from '@hono/node-server'
import { app } from './app.js'
import { startJobs } from './jobs/registry.js'
import { stopQueues } from './lib/queue.js'

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`server listening on http://localhost:${info.port}/api`)
})

startJobs()

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, async () => {
    await stopQueues()
    process.exit(0)
  })
}
