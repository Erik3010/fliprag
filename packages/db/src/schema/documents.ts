import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const documentStatuses = ['processing', 'ready', 'failed'] as const

export const documents = pgTable(
  'documents',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    originalFilename: text(),
    storageKey: text().notNull().unique('documents_storage_key_unique'),
    sizeBytes: integer(),
    pageCount: integer(),
    status: text({ enum: documentStatuses }).notNull().default('processing'),
    processError: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('documents_user_id_idx').on(table.userId)],
)
