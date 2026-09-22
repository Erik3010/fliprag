import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const documents = pgTable(
  'documents',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    originalFilename: text().notNull(),
    // "<userId>/<id>.pdf". A relative path under the uploads dir today, an object key on S3 or R2
    // later, so the row does not change when the files move.
    storageKey: text().notNull().unique('documents_storage_key_unique'),
    sizeBytes: integer().notNull(),
    pageCount: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('documents_user_id_idx').on(table.userId)],
)
