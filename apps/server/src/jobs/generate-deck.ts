import { cards, db, deckProgress, decks, type progressSteps } from '@fliprag/db'
import { and, asc, eq, inArray, ne } from 'drizzle-orm'
import type { ChunkMatch } from '../lib/chroma.js'
import { HttpError } from '../lib/http-error.js'
import { streamCards } from '../lib/openai.js'
import { FOREIGN_KEY_VIOLATION, pgErrorCode } from '../lib/pg-error.js'
import { createQueue } from '../lib/queue.js'
import { SYSTEM_PROMPT, userPrompt } from '../prompts/flashcards.js'
import { search } from '../services/documents.js'

const UNAVAILABLE = 'Generation is not available right now.'
const NO_CARDS = 'No cards could be written from this document.'

const CHUNKS_PER_DECK = 10

type Job = { deckId: string }

type GeneratingDeck = {
  id: string
  userId: string
  documentId: string
  title: string
  description: string | null
  topics: string | null
  cardCount: number
}

const queue = createQueue<Job>('generate-deck')

export function enqueue(deckId: string) {
  queue
    .add(deckId, { deckId })
    .catch((error) => console.error(`Failed to queue deck ${deckId}:`, error))
}

export function start() {
  startWorker()
  requeueGenerating()
}

function startWorker() {
  queue
    .work(async (job) => {
      await run(job.deckId)
    })
    .catch((error) => console.error('Failed to start the deck worker:', error))
}

// The progress row is the source of truth: queue again a deck whose job was lost.
function requeueGenerating() {
  db.select({ deckId: deckProgress.deckId })
    .from(deckProgress)
    .where(inArray(deckProgress.status, ['waiting', 'running']))
    .orderBy(asc(deckProgress.updatedAt))
    .then((rows) => {
      for (const row of rows) {
        enqueue(row.deckId)
      }
    })
    .catch((error) => console.error('Failed to queue decks being made:', error))
}

async function run(deckId: string) {
  const deck = await loadGenerating(deckId)
  if (!deck) return

  try {
    await clearCards(deck.id)
    await markStep(deck.id, 'finding')
    const chunks = await findChunks(deck)
    await markStep(deck.id, 'writing')
    const written = await writeCards(deck, chunks)
    if (written === 0) {
      return await markFailed(deck.id, NO_CARDS)
    }
    await markDone(deck.id)
  } catch (error) {
    // Deleted mid-job: the cascade took its progress, so there is nothing left to mark.
    if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) return
    console.error(`Failed to generate deck ${deck.id}:`, error)
    await markFailed(deck.id, error instanceof HttpError ? error.message : UNAVAILABLE)
  }
}

async function loadGenerating(id: string): Promise<GeneratingDeck | undefined> {
  const [row] = await db
    .select({
      id: decks.id,
      userId: decks.userId,
      documentId: decks.documentId,
      title: decks.title,
      description: decks.description,
      topics: decks.topics,
      cardCount: decks.cardCount,
    })
    .from(decks)
    .innerJoin(deckProgress, eq(deckProgress.deckId, decks.id))
    .where(and(eq(decks.id, id), ne(deckProgress.status, 'failed')))
  return row
}

// A run after a restart starts over. Nobody can edit a deck being made, so every card is the job's.
function clearCards(deckId: string) {
  return db.delete(cards).where(eq(cards.deckId, deckId))
}

function markStep(deckId: string, step: (typeof progressSteps)[number]) {
  return db
    .update(deckProgress)
    .set({ step, status: 'running', error: null, updatedAt: new Date() })
    .where(eq(deckProgress.deckId, deckId))
}

// A deck with no topics searches with its title and description, so it always has a query.
function findChunks(deck: GeneratingDeck) {
  const query = deck.topics ?? [deck.title, deck.description].filter(Boolean).join('\n')
  return search(deck.userId, deck.documentId, query, CHUNKS_PER_DECK)
}

async function writeCards(deck: GeneratingDeck, chunks: ChunkMatch[]) {
  let position = 0
  for await (const card of streamCards(SYSTEM_PROMPT, userPrompt(deck, chunks), deck.cardCount)) {
    await db.insert(cards).values({ deckId: deck.id, front: card.front, back: card.back, position })
    position += 1
    if (position === deck.cardCount) break
  }
  return position
}

function markDone(deckId: string) {
  return db.delete(deckProgress).where(eq(deckProgress.deckId, deckId))
}

function markFailed(deckId: string, error: string) {
  return db
    .update(deckProgress)
    .set({ status: 'failed', error, updatedAt: new Date() })
    .where(eq(deckProgress.deckId, deckId))
}
