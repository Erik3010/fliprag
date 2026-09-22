import { z } from 'zod'

export const uploadLimit = { bytes: 20_000_000, label: '20 MB' } as const

// The browser sends application/pdf for a .pdf; a file with no known type still passes on its
// name, since the page count read on upload is what tells a real PDF from a renamed one.
function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export const uploadDocumentSchema = z.object({
  file: z
    .file('Choose a file to upload.')
    .refine(isPdf, 'Only PDFs can be uploaded.')
    .refine(
      (file) => file.size <= uploadLimit.bytes,
      `That file is larger than ${uploadLimit.label}. Upload a smaller one.`,
    ),
})

export const renameDocumentSchema = z.object({
  name: z.string().trim().min(1, 'Give the document a name.'),
})

export type RenameDocument = z.infer<typeof renameDocumentSchema>
