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

export const searchLimit = { default: 10, max: 50 } as const

export const searchDocumentSchema = z.object({
  query: z.string().trim().min(1, 'Query is required.'),
  limit: z
    .number('Limit must be a number.')
    .int('Limit must be a whole number.')
    .min(1, 'Limit must be at least 1.')
    .max(searchLimit.max, `Limit must be at most ${searchLimit.max}.`)
    .default(searchLimit.default),
})

export type SearchDocument = z.infer<typeof searchDocumentSchema>
