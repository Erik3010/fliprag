import ky, { HTTPError } from 'ky'

export const api = ky.create({
  prefix: '/api/',
  retry: { limit: 2 },
  timeout: 10_000,
})

type ErrorBody = {
  error?: { name?: string; message?: string }
  message?: string
}

// Hono's zValidator rejects with a ZodError envelope rather than { message },
// so the first issue is the closest thing to a sentence we can show.
function firstZodIssue(body: ErrorBody): string | undefined {
  if (body.error?.name !== 'ZodError' || !body.error.message) {
    return undefined
  }

  try {
    const issues = JSON.parse(body.error.message) as Array<{ message?: string }>
    return issues[0]?.message
  } catch {
    return undefined
  }
}

export function failureMessage(error: unknown): string {
  // ky consumes the response to populate `data`, so error.response.json() never works here.
  if (error instanceof HTTPError) {
    const body = typeof error.data === 'object' && error.data ? (error.data as ErrorBody) : null
    const message = body ? (body.message ?? firstZodIssue(body)) : undefined

    return message ?? `The server answered ${error.response.status}.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'The request failed before it got a reply.'
}
