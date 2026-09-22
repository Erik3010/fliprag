import { useCallback, useEffect, useRef, useState } from 'react'
import { placeholderDocuments } from '@/features/documents/placeholder'
import type { PendingUpload, SourceDocument } from '@/features/documents/types'

const MAX_BYTES = 20_000_000

export function rejectReason(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return `${file.name} is not a PDF. Only PDFs can be uploaded.`
  }
  if (file.size > MAX_BYTES) {
    return `${file.name} is larger than 20 MB. Upload a smaller file.`
  }

  return null
}

// TODO: replace the timer with a real upload once the server accepts files. Progress is stepped
// here the way the server will report it, so only this hook changes.
export function useDocumentLibrary() {
  const [documents, setDocuments] = useState<SourceDocument[]>(placeholderDocuments)
  const [upload, setUpload] = useState<PendingUpload | null>(null)
  const [rejected, setRejected] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  const stopTimer = useCallback(() => {
    clearInterval(timer.current)
    timer.current = undefined
  }, [])

  useEffect(() => stopTimer, [stopTimer])

  const start = useCallback(
    (file: File) => {
      const reason = rejectReason(file)
      if (reason) {
        setRejected(reason)
        return
      }

      setRejected(null)
      stopTimer()
      setUpload({ name: file.name, sizeBytes: file.size, progress: 4 })

      timer.current = setInterval(() => {
        setUpload((current) => {
          if (!current) {
            return null
          }

          const progress = current.progress + 7
          if (progress < 100) {
            return { ...current, progress }
          }

          stopTimer()
          setDocuments((rows) => [
            {
              id: crypto.randomUUID(),
              name: current.name,
              pageCount: null,
              sizeBytes: current.sizeBytes,
              addedAt: new Date().toISOString(),
            },
            ...rows,
          ])
          return null
        })
      }, 260)
    },
    [stopTimer],
  )

  const cancel = useCallback(() => {
    stopTimer()
    setUpload(null)
  }, [stopTimer])

  const rename = useCallback((id: string, name: string) => {
    setDocuments((rows) => rows.map((row) => (row.id === id ? { ...row, name } : row)))
  }, [])

  const remove = useCallback((id: string) => {
    setDocuments((rows) => rows.filter((row) => row.id !== id))
  }, [])

  return {
    documents,
    upload,
    rejected,
    dismissRejection: () => setRejected(null),
    start,
    cancel,
    rename,
    remove,
  }
}
