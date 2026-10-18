import { cards, db, deckProgress, decks, documents } from '@fliprag/db'
import type { NewDeck } from '@fliprag/schemas/deck'
import { and, asc, eq } from 'drizzle-orm'
import { HttpError } from '../lib/http-error.js'
import { FOREIGN_KEY_VIOLATION, INVALID_TEXT_REPRESENTATION, pgErrorCode } from '../lib/pg-error.js'

const columns = {
  id: decks.id,
  documentId: decks.documentId,
  title: decks.title,
  description: decks.description,
  topics: decks.topics,
  cardCount: decks.cardCount,
  createdAt: decks.createdAt,
  updatedAt: decks.updatedAt,
}

export type Deck = {
  id: string
  documentId: string
  title: string
  description: string | null
  topics: string | null
  cardCount: number
  createdAt: Date
  updatedAt: Date
}

export type DeckDetail = Deck & {
  documentName: string
  progress: Pick<typeof deckProgress.$inferSelect, 'step' | 'status' | 'error'> | null
  cards: { id: string; front: string; back: string }[]
}

const NOT_FOUND = 'There is no such deck.'
const NO_DOCUMENT = 'There is no such document.'

export async function create(userId: string, details: NewDeck): Promise<Deck> {
  const document = await db.query.documents.findFirst({
    columns: { id: true },
    where: and(eq(documents.id, details.documentId), eq(documents.userId, userId)),
  })
  if (!document) {
    throw new HttpError(404, NO_DOCUMENT)
  }

  try {
    const [row] = await db
      .insert(decks)
      .values({
        userId,
        documentId: details.documentId,
        title: details.title,
        description: details.description || null,
        topics: details.topics || null,
        cardCount: details.cardCount,
      })
      .returning(columns)

    if (!row) {
      throw new Error('Insert returned no row.')
    }
    return row
  } catch (error) {
    // The document was deleted between the check and the insert.
    if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) {
      throw new HttpError(404, NO_DOCUMENT)
    }
    throw error
  }
}

export async function get(userId: string, id: string): Promise<DeckDetail> {
  const [deck] = await db
    .select({ ...columns, documentName: documents.name })
    .from(decks)
    .innerJoin(documents, eq(documents.id, decks.documentId))
    .where(and(eq(decks.id, id), eq(decks.userId, userId)))
    .catch((error: unknown) => {
      // An id that is not a uuid at all is as missing as one that is.
      if (pgErrorCode(error) === INVALID_TEXT_REPRESENTATION) {
        throw new HttpError(404, NOT_FOUND)
      }
      throw error
    })

  if (!deck) {
    throw new HttpError(404, NOT_FOUND)
  }

  const [deckCards, progress] = await Promise.all([
    db
      .select({ id: cards.id, front: cards.front, back: cards.back })
      .from(cards)
      .where(eq(cards.deckId, id))
      .orderBy(asc(cards.position)),
    db.query.deckProgress.findFirst({
      columns: { step: true, status: true, error: true },
      where: eq(deckProgress.deckId, id),
    }),
  ])

  return { ...deck, progress: progress ?? null, cards: deckCards }
}
