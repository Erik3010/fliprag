import { createMiddleware } from 'hono/factory'
import { HttpError } from '../lib/http-error.js'
import { verifyToken } from '../lib/token.js'

export type AuthEnv = { Variables: { userId: string } }

const BEARER = 'Bearer '

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith(BEARER)) {
    throw new HttpError(401, 'Authentication required.')
  }

  let userId: string
  try {
    userId = await verifyToken(header.slice(BEARER.length))
  } catch {
    throw new HttpError(401, 'Session expired.')
  }

  c.set('userId', userId)
  await next()
})
