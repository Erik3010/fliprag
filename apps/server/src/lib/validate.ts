import { HttpError } from './http-error.js'

type Result = { success: boolean; error?: { issues: { message: string }[] } }

export function rejectInvalid(result: Result) {
  if (!result.success) {
    throw new HttpError(400, result.error?.issues[0]?.message ?? 'The request is not valid.')
  }
}
