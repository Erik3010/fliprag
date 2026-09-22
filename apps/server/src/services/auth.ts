import { db, users } from '@fliprag/db'
import type { Credentials } from '@fliprag/schemas/auth'
import { eq } from 'drizzle-orm'
import { hashPassword, signToken, verifyPassword } from '../lib/auth.js'
import { HttpError } from '../lib/http-error.js'
import { pgErrorCode, UNIQUE_VIOLATION } from '../lib/pg-error.js'

export type AuthUser = { id: string; email: string }

export type Session = { token: string; user: AuthUser }

async function session(user: AuthUser): Promise<Session> {
  return { token: await signToken(user.id), user }
}

// One message for a wrong email and a wrong password, so the answer does not say which exists.
const NO_MATCH = 'That email and password do not match.'

export async function signup(credentials: Credentials): Promise<Session> {
  const email = credentials.email.toLowerCase()
  const passwordHash = await hashPassword(credentials.password)

  try {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email })

    if (!user) {
      throw new Error('Insert returned no row.')
    }
    return session(user)
  } catch (error) {
    if (pgErrorCode(error) === UNIQUE_VIOLATION) {
      throw new HttpError(409, 'An account with that email already exists. Sign in instead.')
    }
    throw error
  }
}

// A valid token for a deleted user is a 401, not a 404: the next step is to sign in again.
export async function me(userId: string): Promise<AuthUser> {
  const user = await db.query.users.findFirst({
    columns: { id: true, email: true },
    where: eq(users.id, userId),
  })

  if (!user) {
    throw new HttpError(401, 'Sign in to continue.')
  }

  return user
}

export async function login(credentials: Credentials): Promise<Session> {
  const email = credentials.email.toLowerCase()
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })

  if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
    throw new HttpError(401, NO_MATCH)
  }

  return session({ id: user.id, email: user.email })
}
