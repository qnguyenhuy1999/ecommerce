/**
 * Currency formatter
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Number formatter with optional decimal places
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions & { locale?: string },
): string {
  const { locale = 'en-US', ...rest } = options ?? {}
  return new Intl.NumberFormat(locale, rest).format(value)
}

/**
 * Compact number formatter (e.g., 1000 → "1K", 1000000 → "1M")
 */
export function formatCompact(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value)
}

/**
 * Percentage formatter
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Date formatter
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

/**
 * Relative time formatter (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second')
  }
  if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute')
  }
  if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour')
  }
  return rtf.format(diffDay, 'day')
}
