import { sign, verify } from 'hono/jwt'
import { requireEnv } from './env.js'

const TOKEN_DAYS = 7
const ALGORITHM = 'HS256'

const { JWT_SECRET: secret } = requireEnv('JWT_SECRET')

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
