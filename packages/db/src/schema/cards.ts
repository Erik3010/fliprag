import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { decks } from './decks.js'

export const cards = pgTable(
  'cards',
  {
    id: uuid().primaryKey().defaultRandom(),
    deckId: uuid()
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    // Both sides are a small subset of HTML from the outset, so bold, italic, and underline can
    // arrive later without a migration. Phase 1 never writes a tag into them.
    front: text().notNull(),
    back: text().notNull(),
    // Order inside the deck. Not unique per deck: reordering would have to shuffle through a
    // temporary value to satisfy the constraint, and the list is sorted on read anyway.
    position: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('cards_deck_id_idx').on(table.deckId)],
)
