import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'

export function formatCurrency(
  amount: number,
  options?: {
    currency?: string
    locale?: string
    fractionDigits?: number
  },
): string {
  const { currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE, fractionDigits = 2 } = options ?? {}
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

export function formatNumber(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatCompactNumber(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDate(value: string | Date, pattern: string = 'MMM d, yyyy'): string {
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return ''
  return format(date, pattern)
}

export function formatRelativeDate(value: string | Date, referenceDate?: Date): string {
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return ''
  return formatDistanceToNow(date, {
    addSuffix: true,
    ...(referenceDate ? { baseDate: referenceDate } : {}),
  })
}
