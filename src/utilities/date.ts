// utils/date.ts
import { formatDistanceToNow, isToday, isYesterday, isValid, parse, parseISO } from 'date-fns'
import type { Locale } from 'date-fns'

type DateInput = Date | string | number | null | undefined

type RelativeOptions = {
  /** If input is non-ISO string, provide its format (e.g. "dd/MM/yyyy HH:mm") */
  inFormat?: string
  /** date-fns locale (enUS, fr, arMA, ...) */
  locale?: Locale
  /** "yesterday" / "today" labels */
  labels?: { today?: string; yesterday?: string }
  /** Add "ago"/"in" suffix/prefix */
  addSuffix?: boolean
  /** Fallback when invalid */
  fallback?: string
}

function toDate(input: DateInput, inFormat?: string): Date | null {
  if (input == null || input === '') return null
  if (input instanceof Date) return isValid(input) ? input : null
  if (typeof input === 'number') {
    const d = new Date(input)
    return isValid(d) ? d : null
  }

  const s = String(input).trim()
  let d = inFormat ? parse(s, inFormat, new Date()) : parseISO(s)
  if (!isValid(d)) d = new Date(s)
  return isValid(d) ? d : null
}

/**
 * Examples:
 * - "today"
 * - "yesterday"
 * - "2 days ago"
 * - "in 3 hours"
 */
export function formatRelativeDate(
  input: DateInput,
  {
    inFormat,
    locale,
    labels = { today: 'today', yesterday: 'yesterday' },
    addSuffix = true,
    fallback = '',
  }: RelativeOptions = {},
): string {
  const d = toDate(input, inFormat)
  if (!d) return fallback

  if (isToday(d)) return labels.today ?? 'today'
  if (isYesterday(d)) return labels.yesterday ?? 'yesterday'

  return formatDistanceToNow(d, {
    addSuffix,
    ...(locale ? { locale } : {}),
  })
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
