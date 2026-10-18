import { z } from 'zod'
import { cardSchema } from './card.js'

// The slider's bounds live here so the control and the validation cannot drift apart.
export const cardCount = { min: 1, max: 20, default: 10 } as const

const cardCountMessage = `Card count must be between ${cardCount.min} and ${cardCount.max}.`

export const newDeckSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim(),
  topics: z.string().trim(),
  documentId: z.uuid('Source document is required.'),
  cardCount: z
    .number()
    .int()
    .min(cardCount.min, cardCountMessage)
    .max(cardCount.max, cardCountMessage),
})

export type NewDeck = z.infer<typeof newDeckSchema>

// Topics and the source document are what the deck was made from, so they never change.
export const updateDeckSchema = newDeckSchema
  .pick({ title: true, description: true })
  .partial()
  .extend({
    // The whole list, in order: cards left out are deleted.
    cards: z
      .array(cardSchema)
      .refine((cards) => new Set(cards.map((card) => card.id)).size === cards.length, {
        message: 'Each card must have its own id.',
      })
      .optional(),
  })

export type UpdateDeck = z.infer<typeof updateDeckSchema>
