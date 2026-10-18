import { credentialsSchema, signupSchema } from '@fliprag/schemas/auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { rejectInvalid } from '../lib/validate.js'
import { requireAuth } from '../middleware/require-auth.js'
import * as auth from '../services/auth.js'

export const authRoutes = new Hono()
  .post('/signup', zValidator('json', signupSchema, rejectInvalid), async (c) =>
    c.json(await auth.signup(c.req.valid('json')), 201),
  )
  .post('/login', zValidator('json', credentialsSchema, rejectInvalid), async (c) =>
    c.json(await auth.login(c.req.valid('json'))),
  )
  .get('/me', requireAuth, async (c) => c.json(await auth.me(c.get('userId'))))
