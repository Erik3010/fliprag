import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Column names are snake_case in Postgres and camelCase here. `casing` in the client and in
// drizzle.config.ts does the mapping, so no column needs naming twice.

export const accounts = pgTable('accounts', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
