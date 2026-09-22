import { defineConfig } from 'drizzle-kit'

// drizzle-kit does not read .env on its own. Node 22 can, and the file is optional locally.
try {
  process.loadEnvFile()
} catch {}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
