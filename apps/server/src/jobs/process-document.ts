import { db, documents } from '@fliprag/db'
import { MistralError } from '@mistralai/mistralai/models/errors'
import { and, asc, eq } from 'drizzle-orm'
import * as vectorStore from '../lib/chroma.js'
import { type Chunk, chunkPages, type Page } from '../lib/chunker/chunk.js'
import { HttpError } from '../lib/http-error.js'
import { ocrPdf } from '../lib/mistral.js'
import { embedTexts } from '../lib/openai.js'
import { createQueue } from '../lib/queue.js'
import { storage } from '../lib/storage.js'

const PASSWORD_PROTECTED = 'This PDF is password protected.'
const UNREADABLE = 'This PDF could not be read.'
const NO_TEXT = 'No text was found in this PDF.'
const UNAVAILABLE = 'Reading is not available right now.'

type PositionedChunk = Chunk & { position: number }

export type ProcessResult = {
  model: string
  pages: Page[]
  chunks: PositionedChunk[]
}

type Job = { documentId: string }

type ProcessingDocument = {
  id: string
  userId: string
  name: string
  originalFilename: string | null
  storageKey: string
}

const queue = createQueue<Job>('process-document')

export function enqueue(documentId: string) {
  queue
    .add(documentId, { documentId })
    .catch((error) => console.error(`Failed to queue document ${documentId}:`, error))
}

export function start() {
  startWorker()
  requeueProcessing()
}

function startWorker() {
  queue
    .work(async (job) => {
      await run(job.documentId)
    })
    .catch((error) => console.error('Failed to start the document worker:', error))
}

// The status is the source of truth: queue again a document whose job was lost, from an add that
// failed or a job that crashed.
function requeueProcessing() {
  db.select({ id: documents.id })
    .from(documents)
    .where(eq(documents.status, 'processing'))
    .orderBy(asc(documents.createdAt))
    .then((rows) => {
      for (const row of rows) {
        enqueue(row.id)
      }
    })
    .catch((error) => console.error('Failed to queue processing documents:', error))
}

// Failures mark the document failed: left processing, every restart would pay for it again.
async function run(documentId: string) {
  const document = await loadProcessing(documentId)
  if (!document) return

  try {
    const { model, pages } = await readPdf(document)
    if (pages.every((page) => !page.markdown.trim())) {
      return await markFailed(document.id, NO_TEXT)
    }

    const chunks = (await chunkPages(pages)).map((chunk, position) => ({ position, ...chunk }))
    const embeddings = await embedChunks(chunks)
    await saveResult(document, { model, pages, chunks })
    await saveVectors(document, chunks, embeddings)
    await markReady(document)
  } catch (error) {
    console.error(`Failed to process document ${document.id}:`, error)
    await markFailed(document.id, failureReason(error))
  }
}

async function loadProcessing(id: string): Promise<ProcessingDocument | undefined> {
  const [row] = await db
    .select({
      id: documents.id,
      userId: documents.userId,
      name: documents.name,
      originalFilename: documents.originalFilename,
      storageKey: documents.storageKey,
    })
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.status, 'processing')))
  return row
}

function readPdf(document: ProcessingDocument) {
  const filename = document.originalFilename ?? `${document.name}.pdf`
  return storage.signedUrl(document.storageKey, filename).then((url) => ocrPdf(url, filename))
}

function embedChunks(chunks: PositionedChunk[]) {
  const textToEmbed = (chunk: PositionedChunk) =>
    chunk.headingPath ? `${chunk.headingPath}\n\n${chunk.text}` : chunk.text
  return embedTexts(chunks.map(textToEmbed))
}

function saveVectors(
  document: ProcessingDocument,
  chunks: PositionedChunk[],
  embeddings: number[][],
) {
  return vectorStore.replace(
    document.userId,
    document.id,
    chunks.map((chunk, i) => ({ ...chunk, embedding: embeddings[i] ?? [] })),
  )
}

// Saved before the status changes, so a ready document always has its file and its vectors.
function saveResult(document: ProcessingDocument, result: ProcessResult) {
  return storage.put(resultKey(document.storageKey), JSON.stringify(result), 'application/json')
}

async function markReady(document: ProcessingDocument) {
  const [kept] = await db
    .update(documents)
    .set({ status: 'ready', processError: null })
    .where(and(eq(documents.id, document.id), eq(documents.status, 'processing')))
    .returning({ id: documents.id })
  // Deleted mid-job, after its files were removed.
  if (!kept) {
    await storage.delete(resultKey(document.storageKey)).catch(() => {})
    await vectorStore.remove(document.id).catch(() => {})
  }
}

function markFailed(id: string, processError: string) {
  return db
    .update(documents)
    .set({ status: 'failed', processError })
    .where(and(eq(documents.id, id), eq(documents.status, 'processing')))
}

function failureReason(error: unknown) {
  if (error instanceof HttpError) {
    return error.message
  }
  // A 4xx other than auth or quota is Mistral refusing this file, not being unavailable.
  if (error instanceof MistralError && [400, 413, 422].includes(error.statusCode)) {
    return /password|encrypt/i.test(error.body) ? PASSWORD_PROTECTED : UNREADABLE
  }
  return UNAVAILABLE
}

// The result file
export function resultKey(storageKey: string) {
  return storageKey.replace(/\.pdf$/, '.json')
}
