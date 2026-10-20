import { db, type documentStatuses, documents } from '@fliprag/db'
import type { SearchDocument } from '@fliprag/schemas/document'
import { and, desc, eq, ne } from 'drizzle-orm'
import { PDFDocument } from 'pdf-lib'
import * as processDocument from '../jobs/process-document.js'
import type { ChunkMatch } from '../lib/chroma.js'
import * as vectorStore from '../lib/chroma.js'
import { HttpError } from '../lib/http-error.js'
import { embedText } from '../lib/openai.js'
import { FOREIGN_KEY_VIOLATION, pgErrorCode } from '../lib/pg-error.js'
import { storage } from '../lib/storage.js'

export const documentColumns = {
  id: documents.id,
  name: documents.name,
  originalFilename: documents.originalFilename,
  sizeBytes: documents.sizeBytes,
  pageCount: documents.pageCount,
  status: documents.status,
  processError: documents.processError,
  createdAt: documents.createdAt,
}

export type Document = {
  id: string
  name: string
  originalFilename: string | null
  sizeBytes: number | null
  pageCount: number | null
  status: (typeof documentStatuses)[number]
  processError: string | null
  createdAt: Date
}

const NOT_FOUND = 'Document not found.'

function owned(userId: string, id: string) {
  return and(eq(documents.id, id), eq(documents.userId, userId))
}

// A damaged PDF is still accepted with a null count; processing it is what can reject it.
async function readPageCount(bytes: Uint8Array) {
  try {
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
    return pdf.getPageCount()
  } catch {
    return null
  }
}

export function list(userId: string): Promise<Document[]> {
  return db
    .select(documentColumns)
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt))
}

export async function upload(userId: string, file: File): Promise<Document> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pageCount = await readPageCount(bytes)
  const id = crypto.randomUUID()
  const storageKey = `${userId}/${id}.pdf`

  await storage.put(storageKey, bytes, 'application/pdf')

  try {
    const [row] = await db
      .insert(documents)
      .values({
        id,
        userId,
        name: file.name.replace(/\.pdf$/i, ''),
        originalFilename: file.name,
        storageKey,
        sizeBytes: file.size,
        pageCount,
      })
      .returning(documentColumns)

    if (!row) {
      throw new Error('Insert returned no row.')
    }
    processDocument.enqueue(row.id)
    return row
  } catch (error) {
    await storage.delete(storageKey).catch(() => {})
    throw error
  }
}

export async function fileUrl(userId: string, id: string): Promise<{ url: string }> {
  const row = await db.query.documents.findFirst({
    columns: { storageKey: true, originalFilename: true, name: true },
    where: owned(userId, id),
  })
  if (!row) {
    throw new HttpError(404, NOT_FOUND)
  }

  const filename = row.originalFilename ?? `${row.name}.pdf`
  return { url: await storage.signedUrl(row.storageKey, filename) }
}

export async function search(
  userId: string,
  id: string,
  { query, limit }: SearchDocument,
): Promise<ChunkMatch[]> {
  const row = await db.query.documents.findFirst({
    columns: { status: true },
    where: owned(userId, id),
  })
  if (!row) {
    throw new HttpError(404, NOT_FOUND)
  }
  if (row.status !== 'ready') {
    throw new HttpError(409, 'Document is not ready yet.')
  }

  const embedding = await embedText(query).catch((error: unknown) => {
    throw new HttpError(503, 'Search is not available right now.', error)
  })
  return vectorStore.search(userId, id, embedding, limit)
}

export async function rename(userId: string, id: string, name: string): Promise<Document> {
  const [row] = await db
    .update(documents)
    .set({ name })
    .where(owned(userId, id))
    .returning(documentColumns)
  if (!row) {
    throw new HttpError(404, NOT_FOUND)
  }
  return row
}

export async function remove(userId: string, id: string) {
  const [deleted] = await db
    .delete(documents)
    .where(and(owned(userId, id), ne(documents.status, 'processing')))
    .returning({ id: documents.id, storageKey: documents.storageKey })
    .catch((error: unknown) => {
      if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) {
        throw new HttpError(409, 'Document is in use by one or more decks.')
      }
      throw error
    })

  if (!deleted) {
    const exists = await db.query.documents.findFirst({
      columns: { id: true },
      where: owned(userId, id),
    })
    throw exists
      ? new HttpError(409, 'Document is still being processed.')
      : new HttpError(404, NOT_FOUND)
  }
  // The row is already gone, so a file or vectors left behind are harmless.
  await Promise.all([
    ...[deleted.storageKey, processDocument.resultKey(deleted.storageKey)].map((key) =>
      storage.delete(key).catch(() => {}),
    ),
    vectorStore.remove(deleted.id).catch(() => {}),
  ])
}
