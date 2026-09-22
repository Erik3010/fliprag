import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { documents } from './documents.js'
import { users } from './users.js'

export const decks = pgTable(
  'decks',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    documentId: uuid()
      .notNull()
      .references(() => documents.id, { onDelete: 'restrict' }),
    title: text().notNull(),
    description: text(),
    topics: text(),
    cardCount: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('decks_user_id_idx').on(table.userId),
    index('decks_document_id_idx').on(table.documentId),
  ],
)
