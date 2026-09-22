import { fileURLToPath } from 'node:url'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit does not read .env on its own. Node 22 can. The file sits at the repo root and is
// optional locally, so a missing one is not an error here; the empty url fails later with a
// clearer message from the driver.
try {
  process.loadEnvFile(fileURLToPath(new URL('../../.env', import.meta.url)))
} catch {}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema',
  out: './migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
