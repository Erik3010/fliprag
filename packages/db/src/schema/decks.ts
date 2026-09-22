import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { documents } from './documents.js'
import { users } from './users.js'

export const decks = pgTable(
  'decks',
  {
    id: uuid().primaryKey().defaultRandom(),
    // Also reachable through the document, but kept here so the home list and the ownership check
    // are one query each.
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Restrict, not cascade: deleting a document with decks refuses until the decks are gone.
    // Still open in the PRD, so this is the safe default rather than a settled answer.
    documentId: uuid()
      .notNull()
      .references(() => documents.id, { onDelete: 'restrict' }),
    title: text().notNull(),
    description: text(),
    // Free text, what the deck was asked to cover. Fixed after creation, the same as the document.
    topics: text(),
    // What was asked for, 1 to 20. A request, not a promise: nothing pads a deck to reach it.
    cardCount: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    // Editing a card bumps this too, because the home list is ordered by it.
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('decks_user_id_idx').on(table.userId),
    index('decks_document_id_idx').on(table.documentId),
  ],
)
