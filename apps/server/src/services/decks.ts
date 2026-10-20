import { cards, db, deckProgress, decks, documents } from '@fliprag/db'
import type { CardInput } from '@fliprag/schemas/card'
import type { NewDeck, UpdateDeck } from '@fliprag/schemas/deck'
import { and, asc, count, desc, eq, notInArray } from 'drizzle-orm'
import * as generateDeck from '../jobs/generate-deck.js'
import { HttpError } from '../lib/http-error.js'
import {
  FOREIGN_KEY_VIOLATION,
  INVALID_TEXT_REPRESENTATION,
  pgErrorCode,
  UNIQUE_VIOLATION,
} from '../lib/pg-error.js'
import { type Document, documentColumns } from './documents.js'

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

export type DeckSummary = Deck & {
  document: Document
  cardTotal: number
}

export type DeckDetail = Deck & {
  document: Document
  progress: Pick<typeof deckProgress.$inferSelect, 'step' | 'status' | 'error'> | null
  cards: { id: string; front: string; back: string }[]
}

const NOT_FOUND = 'Deck not found.'
const NO_DOCUMENT = 'Document not found.'

function owned(userId: string, id: string) {
  return and(eq(decks.id, id), eq(decks.userId, userId))
}

// An id that is not a uuid at all is as missing as one that is.
function notFoundOnBadId(error: unknown): never {
  if (pgErrorCode(error) === INVALID_TEXT_REPRESENTATION) {
    throw new HttpError(404, NOT_FOUND)
  }
  throw error
}

export function list(userId: string): Promise<DeckSummary[]> {
  return db
    .select({ ...columns, document: documentColumns, cardTotal: count(cards.id) })
    .from(decks)
    .innerJoin(documents, eq(documents.id, decks.documentId))
    .leftJoin(cards, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(decks.id, documents.id)
    .orderBy(desc(decks.updatedAt))
}

export async function create(userId: string, details: NewDeck): Promise<Deck> {
  const document = await db.query.documents.findFirst({
    columns: { id: true, status: true },
    where: and(eq(documents.id, details.documentId), eq(documents.userId, userId)),
  })
  if (!document) {
    throw new HttpError(404, NO_DOCUMENT)
  }
  if (document.status !== 'ready') {
    throw new HttpError(409, 'Document is not ready yet.')
  }

  try {
    const row = await db.transaction(async (tx) => {
      const [inserted] = await tx
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

      if (!inserted) {
        throw new Error('Insert returned no row.')
      }
      await tx
        .insert(deckProgress)
        .values({ deckId: inserted.id, step: 'finding', status: 'waiting' })
      return inserted
    })
    generateDeck.enqueue(row.id)
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
    .select({ ...columns, document: documentColumns })
    .from(decks)
    .innerJoin(documents, eq(documents.id, decks.documentId))
    .where(owned(userId, id))
    .catch(notFoundOnBadId)

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

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export async function update(userId: string, id: string, changes: UpdateDeck): Promise<DeckDetail> {
  await db
    .transaction(async (tx) => {
      const [row] = await tx
        .update(decks)
        .set({
          title: changes.title,
          description: changes.description === undefined ? undefined : changes.description || null,
          updatedAt: new Date(),
        })
        .where(owned(userId, id))
        .returning({ id: decks.id })
        .catch(notFoundOnBadId)

      if (!row) {
        throw new HttpError(404, NOT_FOUND)
      }
      if (changes.cards) {
        await replaceCards(tx, id, changes.cards)
      }
    })
    .catch((error: unknown) => {
      // A new card's id is already taken by a card in another deck.
      if (pgErrorCode(error) === UNIQUE_VIOLATION) {
        throw new HttpError(409, 'Card id already exists.')
      }
      throw error
    })

  return get(userId, id)
}

async function replaceCards(tx: Transaction, deckId: string, list: CardInput[]) {
  const existing = await tx.select({ id: cards.id }).from(cards).where(eq(cards.deckId, deckId))
  const known = new Set(existing.map((card) => card.id))

  const kept = list.map((card) => card.id)
  await tx.delete(cards).where(and(eq(cards.deckId, deckId), notInArray(cards.id, kept)))

  for (const [position, card] of list.entries()) {
    if (known.has(card.id)) {
      await tx
        .update(cards)
        .set({ front: card.front, back: card.back, position, updatedAt: new Date() })
        .where(eq(cards.id, card.id))
    } else {
      await tx
        .insert(cards)
        .values({ id: card.id, deckId, front: card.front, back: card.back, position })
    }
  }
}

export async function remove(userId: string, id: string) {
  const [deleted] = await db
    .delete(decks)
    .where(owned(userId, id))
    .returning({ id: decks.id })
    .catch(notFoundOnBadId)

  if (!deleted) {
    throw new HttpError(404, NOT_FOUND)
  }
}
