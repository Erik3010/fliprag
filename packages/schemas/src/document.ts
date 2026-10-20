import { z } from 'zod'

export const uploadLimit = { bytes: 20_000_000, label: '20 MB' } as const

// The browser sends application/pdf for a .pdf; a file with no known type still passes on its
// name, since the page count read on upload is what tells a real PDF from a renamed one.
function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export const uploadDocumentSchema = z.object({
  file: z
    .file('File is required.')
    .refine(isPdf, 'Only PDF files are supported.')
    .refine(
      (file) => file.size <= uploadLimit.bytes,
      `File exceeds the ${uploadLimit.label} limit.`,
    ),
})

export const renameDocumentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
})

export type RenameDocument = z.infer<typeof renameDocumentSchema>
