import { uploadLimit } from '@fliprag/schemas/document'
import { toast } from '@fliprag/ui/components/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { deleteDocument, renameDocument, uploadDocument } from '@/features/documents/api'
import { documentsQueryKey, useDocuments } from '@/features/documents/hooks/use-documents'
import { useOpenDocument } from '@/features/documents/hooks/use-open-document'
import type { PendingUpload } from '@/features/documents/types'
import { failureMessage } from '@/lib/http'

// Checked before upload, so the message can name the rule the file broke.
export function rejectReason(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return `${file.name} is not a PDF. Only PDF files are supported.`
  }
  if (file.size > uploadLimit.bytes) {
    return `${file.name} exceeds the ${uploadLimit.label} limit.`
  }

  return null
}

export function useDocumentLibrary() {
  const queryClient = useQueryClient()
  const list = useDocuments()
  const [upload, setUpload] = useState<PendingUpload | null>(null)
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
        toast.error(reason)
        return
      }

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
          toast.error(`Failed to upload ${file.name}. ${failureMessage(error)}`)
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
    onError: (error) => toast.error(`Failed to rename document. ${failureMessage(error)}`),
  })

  const remove = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted successfully.')
      return refresh()
    },
    onError: (error) => toast.error(`Failed to delete document. ${failureMessage(error)}`),
  })

  const open = useOpenDocument()

  return {
    ...list,
    upload,
    start,
    cancel: () => controller.current?.abort(),
    rename: (id: string, name: string) => rename.mutate({ id, name }),
    remove: (id: string) => remove.mutate(id),
    open,
  }
}
