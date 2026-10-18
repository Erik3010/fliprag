import { z } from 'zod'

export const cardSchema = z.object({
  id: z.uuid('Each card needs an id.'),
  front: z.string().trim(),
  back: z.string().trim(),
})

export type CardInput = z.infer<typeof cardSchema>
