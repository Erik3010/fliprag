import { db, documents } from '@fliprag/db'
import { and, desc, eq } from 'drizzle-orm'
import { PDFDocument } from 'pdf-lib'
import { HttpError } from '../lib/http-error.js'
import { FOREIGN_KEY_VIOLATION, pgErrorCode } from '../lib/pg-error.js'
import { storage } from '../lib/storage.js'

export const documentColumns = {
  id: documents.id,
  name: documents.name,
  originalFilename: documents.originalFilename,
  sizeBytes: documents.sizeBytes,
  pageCount: documents.pageCount,
  createdAt: documents.createdAt,
}

export type Document = {
  id: string
  name: string
  originalFilename: string | null
  sizeBytes: number | null
  /** Null when the page tree could not be read. The file is kept either way. */
  pageCount: number | null
  createdAt: Date
}

const NOT_FOUND = 'There is no such document.'

function owned(userId: string, id: string) {
  return and(eq(documents.id, id), eq(documents.userId, userId))
}

// The one thing phase 1 opens a PDF for. No text is read. A damaged file is accepted, as the PRD
// says, and the count is null; phase 2's generator is the first thing that can object to it.
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

  await storage.put(storageKey, bytes)

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
    return row
  } catch (error) {
    await storage.delete(storageKey)
    throw error
  }
}

export async function getFile(userId: string, id: string) {
  const row = await db.query.documents.findFirst({
    columns: { storageKey: true, originalFilename: true, name: true },
    where: owned(userId, id),
  })
  if (!row) {
    throw new HttpError(404, NOT_FOUND)
  }

  return {
    bytes: await storage.get(row.storageKey),
    filename: row.originalFilename ?? `${row.name}.pdf`,
  }
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
    .where(owned(userId, id))
    .returning({ storageKey: documents.storageKey })
    .catch((error: unknown) => {
      if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) {
        throw new HttpError(409, 'This document has decks made from it. Delete those first.')
      }
      throw error
    })

  if (!deleted) {
    throw new HttpError(404, NOT_FOUND)
  }
  await storage.delete(deleted.storageKey)
}
