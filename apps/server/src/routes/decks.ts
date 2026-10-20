import { newDeckSchema, updateDeckSchema } from '@fliprag/schemas/deck'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { rejectInvalid } from '../lib/validate.js'
import type { AuthEnv } from '../middleware/require-auth.js'
import * as decks from '../services/decks.js'

export const deckRoutes = new Hono<AuthEnv>()
  .get('/', async (c) => c.json(await decks.list(c.get('userId'))))
  .post('/', zValidator('json', newDeckSchema, rejectInvalid), async (c) =>
    c.json(await decks.create(c.get('userId'), c.req.valid('json')), 201),
  )
  .get('/:id', async (c) => c.json(await decks.get(c.get('userId'), c.req.param('id'))))
  .get('/:id/events', async (c) => {
    const changes = await decks.watch(c.get('userId'), c.req.param('id'))
    return streamSSE(c, async (stream) => {
      for await (const deck of changes) {
        if (stream.aborted) break
        await stream.writeSSE({ event: 'deck', data: JSON.stringify(deck) })
      }
    })
  })
  .patch('/:id', zValidator('json', updateDeckSchema, rejectInvalid), async (c) =>
    c.json(await decks.update(c.get('userId'), c.req.param('id'), c.req.valid('json'))),
  )
  .delete('/:id', async (c) => {
    await decks.remove(c.get('userId'), c.req.param('id'))
    return c.body(null, 204)
  })
