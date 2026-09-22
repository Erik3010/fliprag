import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../lib/auth.js'
import { HttpError } from '../lib/http-error.js'

export type AuthEnv = { Variables: { userId: string } }

const BEARER = 'Bearer '

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith(BEARER)) {
    throw new HttpError(401, 'Sign in to continue.')
  }

  let userId: string
  try {
    userId = await verifyToken(header.slice(BEARER.length))
  } catch {
    throw new HttpError(401, 'Your sign-in has expired. Sign in again.')
  }

  c.set('userId', userId)
  await next()
})
