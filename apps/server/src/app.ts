import { DrizzleQueryError } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { HttpError } from './lib/http-error.js'
import { authRoutes } from './routes/auth.js'
import { healthRoutes } from './routes/health.js'

export const app = new Hono()
  .basePath('/api')
  .route('/health', healthRoutes)
  .route('/auth', authRoutes)

app.onError((error, c) => {
  if (error instanceof HttpError) {
    return c.json({ message: error.message }, error.status)
  }
  if (error instanceof HTTPException) {
    return c.json({ message: error.message || 'The request was refused.' }, error.status)
  }

  console.error(describe(error))
  return c.json({ message: 'Something went wrong on the server.' }, 500)
})

// Drizzle's message includes the query params, which on a failed signup is the password hash.
function describe(error: Error) {
  if (error instanceof DrizzleQueryError) {
    return `Failed query: ${error.query}\n${reason(error.cause)}`
  }
  return error.stack ?? error.message
}

// A connection error has an empty message; its reason is the code (ECONNREFUSED).
function reason(cause: unknown) {
  if (!(cause instanceof Error)) {
    return String(cause)
  }
  return cause.message || ('code' in cause ? String(cause.code) : cause.name)
}

app.notFound((c) => c.json({ message: 'There is no such route.' }, 404))

export type AppType = typeof app
