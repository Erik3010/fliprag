import { toast } from '@fliprag/ui/components/sonner'
import { useCallback } from 'react'
import { fetchDocumentFile } from '@/features/documents/api'
import { failureMessage } from '@/lib/http'

export function useOpenDocument() {
  return useCallback(async (id: string) => {
    try {
      window.open(await fetchDocumentFile(id), '_blank', 'noopener')
    } catch (error) {
      toast.error(`Failed to open file. ${failureMessage(error)}`)
    }
  }, [])
}
