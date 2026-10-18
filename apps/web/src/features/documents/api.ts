import type { RenameDocument } from '@fliprag/schemas/document'
import type { SourceDocument } from '@/features/documents/types'
import { api } from '@/lib/http'
import { useAuthStore } from '@/store/auth'

export function listDocuments() {
  return api.get('documents').json<SourceDocument[]>()
}

export function renameDocument(id: string, body: RenameDocument) {
  return api.patch(`documents/${id}`, { json: body }).json<SourceDocument>()
}

export function deleteDocument(id: string) {
  return api.delete(`documents/${id}`)
}

// A plain link can't send the Bearer header, so the file is fetched and opened as a blob URL.
export async function fetchDocumentFile(id: string) {
  const blob = await api.get(`documents/${id}/file`).blob()
  return URL.createObjectURL(blob)
}

type UploadOptions = {
  onProgress: (percent: number) => void
  signal: AbortSignal
}

// XMLHttpRequest, not ky: fetch only reports upload progress over HTTP/2, and the dev proxy is
// HTTP/1.1. Errors are thrown as Error(message) so failureMessage can read them.
export function uploadDocument(file: File, { onProgress, signal }: UploadOptions) {
  return new Promise<SourceDocument>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const body = new FormData()
    body.set('file', file)

    xhr.open('POST', '/api/documents')
    const { token } = useAuthStore.getState()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
        return
      }
      if (xhr.status === 401) {
        useAuthStore.getState().signOut()
      }
      let message = `Request failed with status ${xhr.status}.`
      try {
        message = JSON.parse(xhr.responseText).message ?? message
      } catch {}
      reject(new Error(message))
    }
    xhr.onerror = () => reject(new Error('Network error. The server could not be reached.'))
    xhr.onabort = () => reject(new DOMException('The upload was cancelled.', 'AbortError'))

    signal.addEventListener('abort', () => xhr.abort(), { once: true })
    xhr.send(body)
  })
}
