import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './index.js'

// drizzle-kit is a dev tool and not in the production image, so production migrates through here.
await migrate(db, { migrationsFolder: fileURLToPath(new URL('../migrations', import.meta.url)) })
await client.end()
console.log('Migrations applied.')
