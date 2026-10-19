import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class HttpError extends Error {
  readonly status: ContentfulStatusCode

  constructor(status: ContentfulStatusCode, message: string, cause?: unknown) {
    super(message, { cause })
    this.name = 'HttpError'
    this.status = status
  }
}
