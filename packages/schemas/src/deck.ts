import { z } from 'zod'

// The slider's bounds live here so the control and the validation cannot drift apart.
export const cardCount = { min: 1, max: 20, default: 10 } as const

export const newDeckSchema = z.object({
  title: z.string().trim().min(1, 'Give the deck a title before saving.'),
  description: z.string().trim(),
  topics: z.string().trim(),
  documentId: z.string().min(1, 'Choose the document this deck is made from.'),
  cardCount: z.number().int().min(cardCount.min).max(cardCount.max),
})

export type NewDeck = z.infer<typeof newDeckSchema>
