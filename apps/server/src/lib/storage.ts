import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export type Storage = {
  put(key: string, bytes: Uint8Array): Promise<void>
  get(key: string): Promise<Uint8Array>
  delete(key: string): Promise<void>
}

// Local disk for phase 1. S3 or R2 later is a second object with the same three methods; the
// keys in the database do not change. docs/database.md, "storage_key, not a path".
const root =
  process.env.UPLOADS_DIR ?? fileURLToPath(new URL('../../../../uploads', import.meta.url))

function pathFor(key: string) {
  const path = resolve(root, key)
  if (!path.startsWith(`${root}/`)) {
    throw new Error(`Storage key escapes the uploads directory: ${key}`)
  }
  return path
}

export const storage: Storage = {
  async put(key, bytes) {
    const path = pathFor(key)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, bytes)
  },
  get(key) {
    return readFile(pathFor(key))
  },
  delete(key) {
    return rm(pathFor(key), { force: true })
  },
}
