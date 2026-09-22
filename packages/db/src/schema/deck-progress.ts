import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { decks } from './decks.js'

export const progressSteps = ['reading', 'finding', 'writing'] as const
export const progressStatuses = ['waiting', 'running', 'done', 'failed'] as const

export const deckProgress = pgTable('deck_progress', {
  deckId: uuid()
    .primaryKey()
    .references(() => decks.id, { onDelete: 'cascade' }),
  step: text({ enum: progressSteps }).notNull(),
  status: text({ enum: progressStatuses }).notNull(),
  error: text(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
