import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { decks } from './decks.js'

export const cards = pgTable(
  'cards',
  {
    id: uuid().primaryKey().defaultRandom(),
    deckId: uuid()
      .notNull()
      .references(() => decks.id, { onDelete: 'cascade' }),
    front: text().notNull(),
    back: text().notNull(),
    position: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('cards_deck_id_idx').on(table.deckId)],
)
