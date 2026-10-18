import { db, decks, documents } from '@fliprag/db'
import type { NewDeck } from '@fliprag/schemas/deck'
import { and, eq } from 'drizzle-orm'
import { HttpError } from '../lib/http-error.js'
import { FOREIGN_KEY_VIOLATION, pgErrorCode } from '../lib/pg-error.js'

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
