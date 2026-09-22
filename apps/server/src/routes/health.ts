import { db } from '@fliprag/db'
import { sql } from 'drizzle-orm'
import { Hono } from 'hono'

const startedAt = Date.now()

export const healthRoutes = new Hono().get('/', async (c) => {
  const uptime = (Date.now() - startedAt) / 1000

  try {
    await db.execute(sql`select 1`)
  } catch {
    return c.json({ status: 'error', uptime, message: 'The database is not reachable.' }, 503)
  }

  return c.json({ status: 'ok', uptime })
})
