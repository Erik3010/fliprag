import { credentialsSchema } from '@fliprag/schemas/auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

const startedAt = Date.now()

export const app = new Hono().basePath('/api')

app.get('/health', (c) =>
  c.json({
    status: 'ok',
    uptime: (Date.now() - startedAt) / 1000,
  }),
)

// TODO: store and verify accounts. Until then these validate the payload and say so.
app.post('/auth/signup', zValidator('json', credentialsSchema), (c) =>
  c.json({ message: 'Accounts are not connected yet, so nothing was saved.' }, 501),
)

app.post('/auth/login', zValidator('json', credentialsSchema), (c) =>
  c.json({ message: 'Accounts are not connected yet, so nothing was checked.' }, 501),
)

export type AppType = typeof app
