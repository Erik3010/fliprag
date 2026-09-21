import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const startedAt = Date.now()

const app = new Hono().basePath('/api')

app.get('/health', (c) =>
  c.json({
    status: 'ok',
    uptime: (Date.now() - startedAt) / 1000,
  }),
)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`server listening on http://localhost:${info.port}/api`)
})

export type AppType = typeof app
