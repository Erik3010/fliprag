export type SourceDocument = {
  id: string
  name: string
  /** Null until the file has been read, which does not happen in phase 1. */
  pageCount: number | null
  sizeBytes: number
  addedAt: string
}

export type PendingUpload = {
  name: string
  sizeBytes: number
  progress: number
}
