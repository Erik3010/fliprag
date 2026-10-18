// Drizzle wraps the driver error, so the SQLSTATE code sits on `cause`.
export function pgErrorCode(error: unknown) {
  const cause = error instanceof Error && error.cause ? error.cause : error
  return typeof cause === 'object' && cause !== null && 'code' in cause ? String(cause.code) : null
}

export const UNIQUE_VIOLATION = '23505'
export const FOREIGN_KEY_VIOLATION = '23503'
export const INVALID_TEXT_REPRESENTATION = '22P02'
