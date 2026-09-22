import { renameDocumentSchema, uploadDocumentSchema } from '@fliprag/schemas/document'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { rejectInvalid } from '../lib/validate.js'
import type { AuthEnv } from '../middleware/require-auth.js'
import * as documents from '../services/documents.js'

export const documentRoutes = new Hono<AuthEnv>()
  .get('/', async (c) => c.json(await documents.list(c.get('userId'))))
  .post('/', zValidator('form', uploadDocumentSchema, rejectInvalid), async (c) =>
    c.json(await documents.upload(c.get('userId'), c.req.valid('form').file), 201),
  )
  .get('/:id/file', async (c) => {
    const { bytes, filename } = await documents.getFile(c.get('userId'), c.req.param('id'))
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
      },
    })
  })
  .patch('/:id', zValidator('json', renameDocumentSchema, rejectInvalid), async (c) =>
    c.json(await documents.rename(c.get('userId'), c.req.param('id'), c.req.valid('json').name)),
  )
  .delete('/:id', async (c) => {
    await documents.remove(c.get('userId'), c.req.param('id'))
    return c.body(null, 204)
  })
