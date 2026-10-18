import { uploadLimit } from '@fliprag/schemas/document'
import { toast } from '@fliprag/ui/components/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteDocument,
  fetchDocumentFile,
  renameDocument,
  uploadDocument,
} from '@/features/documents/api'
import { documentsQueryKey, useDocuments } from '@/features/documents/hooks/use-documents'
import type { PendingUpload } from '@/features/documents/types'
import { failureMessage } from '@/lib/http'

// Checked before anything is sent, so the refusal names the rule the file broke.
export function rejectReason(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return `${file.name} is not a PDF. Only PDFs can be uploaded.`
  }
  if (file.size > uploadLimit.bytes) {
    return `${file.name} is larger than ${uploadLimit.label}. Upload a smaller file.`
  }

  return null
}

export function useDocumentLibrary() {
  const queryClient = useQueryClient()
  const list = useDocuments()
  const [upload, setUpload] = useState<PendingUpload | null>(null)
  const [rejected, setRejected] = useState<string | null>(null)
  const controller = useRef<AbortController>(undefined)

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: documentsQueryKey }),
    [queryClient],
  )

  useEffect(() => () => controller.current?.abort(), [])

  const start = useCallback(
    async (file: File) => {
      const reason = rejectReason(file)
      if (reason) {
        setRejected(reason)
        return
      }

      setRejected(null)
      controller.current?.abort()
      controller.current = new AbortController()
      setUpload({ name: file.name, sizeBytes: file.size, progress: 0 })

      try {
        await uploadDocument(file, {
          signal: controller.current.signal,
          onProgress: (progress) => setUpload((current) => current && { ...current, progress }),
        })
        await refresh()
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setRejected(`${file.name} was not uploaded. ${failureMessage(error)}`)
        }
      } finally {
        setUpload(null)
      }
    },
    [refresh],
  )

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameDocument(id, { name }),
    onSuccess: refresh,
    onError: (error) => toast.error(`The name was not saved. ${failureMessage(error)}`),
  })

  const remove = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted successfully.')
      return refresh()
    },
    onError: (error) => toast.error(`The document was not deleted. ${failureMessage(error)}`),
  })

  const open = useCallback(async (id: string) => {
    try {
      window.open(await fetchDocumentFile(id), '_blank', 'noopener')
    } catch (error) {
      toast.error(`The file could not be opened. ${failureMessage(error)}`)
    }
  }, [])

  return {
    ...list,
    upload,
    rejected,
    dismissRejection: () => setRejected(null),
    start,
    cancel: () => controller.current?.abort(),
    rename: (id: string, name: string) => rename.mutate({ id, name }),
    remove: (id: string) => remove.mutate(id),
    open,
  }
}
