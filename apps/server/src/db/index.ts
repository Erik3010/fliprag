import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error('DATABASE_URL is not set. Copy apps/server/.env.example to .env.')
}

export const client = postgres(url)

export const db = drizzle({ client, schema, casing: 'snake_case' })
