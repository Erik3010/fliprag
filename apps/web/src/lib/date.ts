import { differenceInCalendarDays, intlFormatDistance } from 'date-fns'

// Shows days for the first month, then months. A change late last night still counts as "yesterday".
export function relativeDay(iso: string) {
  const then = new Date(iso)
  const now = new Date()
  const unit = differenceInCalendarDays(then, now) > -30 ? 'day' : 'month'

  return intlFormatDistance(then, now, { unit, numeric: 'auto' })
}
