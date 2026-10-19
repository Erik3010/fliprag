import { toast } from '@fliprag/ui/components/sonner'
import { useCallback } from 'react'
import { documentFileUrl } from '@/features/documents/api'
import { failureMessage } from '@/lib/http'

export function useOpenDocument() {
  return useCallback(async (id: string) => {
    // Browsers only allow a new tab during the click, so it opens before the link has arrived.
    const tab = window.open('', '_blank')
    try {
      const url = await documentFileUrl(id)
      if (tab) {
        tab.location.href = url
      } else {
        window.location.href = url
      }
    } catch (error) {
      tab?.close()
      toast.error(`Failed to open file. ${failureMessage(error)}`)
    }
  }, [])
}
