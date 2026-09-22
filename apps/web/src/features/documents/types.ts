export type SourceDocument = {
  id: string
  name: string
  originalFilename: string | null
  sizeBytes: number | null
  /** Null when the page tree could not be read at upload. */
  pageCount: number | null
  createdAt: string
}

export type PendingUpload = {
  name: string
  sizeBytes: number
  /** 0 to 100. */
  progress: number
}
