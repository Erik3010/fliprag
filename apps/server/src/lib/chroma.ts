import { ChromaClient, type Collection, type QueryRowResult } from 'chromadb'
import { requireEnv } from './env.js'
import { HttpError } from './http-error.js'

export type StoredChunk = {
  position: number
  text: string
  headingPath: string | null
  firstPage: number
  lastPage: number
  embedding: number[]
}

export type ChunkMatch = Omit<StoredChunk, 'embedding'> & { distance: number }

type ChunkMetadata = {
  userId: string
  documentId: string
  position: number
  firstPage: number
  lastPage: number
  headingPath: string | null
}

const { CHROMA_URL } = requireEnv('CHROMA_URL')
const url = new URL(CHROMA_URL)

const COLLECTION = 'chunks'

const client = new ChromaClient({
  host: url.hostname,
  port: Number(url.port) || (url.protocol === 'https:' ? 443 : 80),
  ssl: url.protocol === 'https:',
})

let cached: Promise<Collection> | undefined

// Chroma is handed the vectors, so the collection has no embedding function of its own.
function getCollection() {
  cached ??= client
    .getOrCreateCollection({
      name: COLLECTION,
      embeddingFunction: null,
      configuration: { hnsw: { space: 'cosine' } },
    })
    .catch((error: unknown) => {
      cached = undefined
      throw error
    })
  return cached
}

async function call<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    throw new HttpError(503, 'The vector store is not reachable.', error)
  }
}

// Delete first, so a run after a restart leaves nothing from the run before.
export function replace(userId: string, documentId: string, chunks: StoredChunk[]) {
  return call(async () => {
    const collection = await getCollection()
    await collection.delete({ where: { documentId } })
    if (chunks.length === 0) return
    await collection.add({
      ids: chunks.map((chunk) => `${documentId}:${chunk.position}`),
      embeddings: chunks.map((chunk) => chunk.embedding),
      documents: chunks.map((chunk) => chunk.text),
      metadatas: chunks.map((chunk) => toMetadata(userId, documentId, chunk)),
    })
  })
}

export function search(
  userId: string,
  documentId: string,
  embedding: number[],
  limit: number,
): Promise<ChunkMatch[]> {
  return call(async () => {
    const collection = await getCollection()
    const result = await collection.query<ChunkMetadata>({
      queryEmbeddings: [embedding],
      nResults: limit,
      where: { $and: [{ userId: { $eq: userId } }, { documentId: { $eq: documentId } }] },
      include: ['documents', 'metadatas', 'distances'],
    })
    return (result.rows()[0] ?? []).map(toMatch)
  })
}

export function remove(documentId: string) {
  return call(async () => {
    const collection = await getCollection()
    await collection.delete({ where: { documentId } })
  })
}

export function ping() {
  return call(async () => {
    await client.heartbeat()
  })
}

function toMetadata(userId: string, documentId: string, chunk: StoredChunk): ChunkMetadata {
  const { position, firstPage, lastPage, headingPath } = chunk
  return { userId, documentId, position, firstPage, lastPage, headingPath }
}

function toMatch({ document, metadata, distance }: QueryRowResult<ChunkMetadata>): ChunkMatch {
  if (!metadata) {
    throw new Error('Chunk has no metadata.')
  }
  const { position, firstPage, lastPage, headingPath } = metadata
  return {
    position,
    text: document ?? '',
    // Chroma stores a null value by dropping the key.
    headingPath: headingPath ?? null,
    firstPage,
    lastPage,
    distance: distance ?? 0,
  }
}
