import { z } from 'zod'

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
