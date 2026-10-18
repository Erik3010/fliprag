import { client, db, users } from '@fliprag/db'
import { hashPassword } from './lib/auth.js'

// The development users. docs/setup.md lists them. Safe to run again: existing rows are left alone.
const seedUsers = [
  { name: 'Admin', email: 'admin@example.com', password: 'password123' },
  { name: 'User', email: 'user@example.com', password: 'password123' },
  { name: 'Guest', email: 'guest@example.com', password: 'password123' },
]

const rows = await Promise.all(
  seedUsers.map(async ({ name, email, password }) => ({
    name,
    email,
    passwordHash: await hashPassword(password),
  })),
)

const inserted = await db
  .insert(users)
  .values(rows)
  .onConflictDoNothing({ target: users.email })
  .returning({ email: users.email })

const created = new Set(inserted.map((row) => row.email))
for (const { email } of seedUsers) {
  console.log(created.has(email) ? `created ${email}` : `${email} already exists, nothing done`)
}

await client.end()
