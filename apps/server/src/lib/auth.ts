import bcrypt from 'bcryptjs'
import { sign, verify } from 'hono/jwt'

const COST = 12

export function hashPassword(password: string) {
  return bcrypt.hash(password, COST)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

const TOKEN_DAYS = 7
const ALGORITHM = 'HS256'

const secret = requireSecret()

function requireSecret() {
  const value = process.env.JWT_SECRET
  if (!value) {
    throw new Error('JWT_SECRET is not set. Copy .env.example at the repo root to .env.')
  }
  return value
}

export function signToken(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_DAYS * 24 * 60 * 60
  return sign({ sub: userId, exp }, secret, ALGORITHM)
}

export async function verifyToken(token: string) {
  const payload = await verify(token, secret, ALGORITHM)
  if (typeof payload.sub !== 'string') {
    throw new Error('Token has no subject.')
  }
  return payload.sub
}
