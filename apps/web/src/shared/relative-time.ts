import { differenceInCalendarDays, intlFormatDistance } from 'date-fns'

// "today", "yesterday", "5 days ago", "last month". Days for the first month, months after that,
// because "47 days ago" is a number nobody reads as a length of time.
// Calendar days, not elapsed hours: something edited at 11pm is "yesterday" by the next morning.
export function relativeDay(iso: string) {
  const then = new Date(iso)
  const now = new Date()
  const unit = differenceInCalendarDays(then, now) > -30 ? 'day' : 'month'

  return intlFormatDistance(then, now, { unit, numeric: 'auto' })
}
