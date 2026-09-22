import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { decks } from './decks.js'

export const progressSteps = ['reading', 'finding', 'writing', 'saving'] as const
export const progressStatuses = ['waiting', 'running', 'done', 'failed'] as const

// One row per deck while it is being made, deleted once it is done. Holds the step the work is on
// and how that step is going; earlier steps are done and later ones waiting by definition, so the
// screen can draw all four from this one row. Plain text with a TypeScript union rather than a
// Postgres enum, since adding a value to an enum is its own migration and these will change in
// phase 2.
export const deckProgress = pgTable('deck_progress', {
  deckId: uuid()
    .primaryKey()
    .references(() => decks.id, { onDelete: 'cascade' }),
  step: text({ enum: progressSteps }).notNull(),
  status: text({ enum: progressStatuses }).notNull(),
  // Set when status is failed, so the screen can say what went wrong rather than that something did.
  error: text(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
