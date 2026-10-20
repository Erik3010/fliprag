export type SourceDocument = {
  id: string
  name: string
  originalFilename: string | null
  sizeBytes: number | null
  pageCount: number | null
  status: 'processing' | 'ready' | 'failed'
  /** The reason shown when status is failed. */
  processError: string | null
  createdAt: string
}

export type PendingUpload = {
  name: string
  sizeBytes: number
  /** 0 to 100. */
  progress: number
}
