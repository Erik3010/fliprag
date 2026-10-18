import { newDeckSchema } from '@fliprag/schemas/deck'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { rejectInvalid } from '../lib/validate.js'
import type { AuthEnv } from '../middleware/require-auth.js'
import * as decks from '../services/decks.js'

export const deckRoutes = new Hono<AuthEnv>()
  .post('/', zValidator('json', newDeckSchema, rejectInvalid), async (c) =>
    c.json(await decks.create(c.get('userId'), c.req.valid('json')), 201),
  )
  .get('/:id', async (c) => c.json(await decks.get(c.get('userId'), c.req.param('id'))))
