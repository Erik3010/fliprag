import { credentialsSchema } from '@fliprag/schemas/auth'
import { zValidator } from '@hono/zod-validator'
import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from './db/index.js'

const startedAt = Date.now()

export const app = new Hono().basePath('/api')

app.get('/health', async (c) => {
  const uptime = (Date.now() - startedAt) / 1000

  try {
    await db.execute(sql`select 1`)
  } catch {
    return c.json({ status: 'error', uptime, message: 'The database is not reachable.' }, 503)
  }

  return c.json({ status: 'ok', uptime })
})

// TODO: store and verify accounts. Until then these validate the payload and say so.
app.post('/auth/signup', zValidator('json', credentialsSchema), (c) =>
  c.json({ message: 'Accounts are not connected yet, so nothing was saved.' }, 501),
)

app.post('/auth/login', zValidator('json', credentialsSchema), (c) =>
  c.json({ message: 'Accounts are not connected yet, so nothing was checked.' }, 501),
)

export type AppType = typeof app
