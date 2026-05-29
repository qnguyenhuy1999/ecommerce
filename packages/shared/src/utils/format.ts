import { format, formatDistanceToNow, intlFormat, parseISO, isValid } from 'date-fns'

const DEFAULT_CURRENCY = 'USD'
const DEFAULT_LOCALE = 'en-US'
const DEFAULT_DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}

type DateValue = string | Date
type Locale = string | string[]

function parseDateValue(value: DateValue): Date {
  return typeof value === 'string' ? parseISO(value) : value
}

function formatWithIntl(
  value: DateValue,
  formatOptions?: Intl.DateTimeFormatOptions,
  locale?: Locale,
): string {
  const date = parseDateValue(value)
  if (!isValid(date)) return ''

  if (formatOptions && locale) {
    return intlFormat(date, formatOptions, { locale })
  }

  if (formatOptions) {
    return intlFormat(date, formatOptions)
  }

  if (locale) {
    return intlFormat(date, { locale })
  }

  return intlFormat(date)
}

export function formatCurrency(
  amount: number,
  options?: {
    currency?: string
    locale?: string
    fractionDigits?: number
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
): string {
  const {
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    fractionDigits = 2,
    minimumFractionDigits = fractionDigits,
    maximumFractionDigits = fractionDigits,
  } = options ?? {}
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
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

export function formatCompactCurrency(
  amount: number,
  options?: {
    currency?: string
    locale?: string
    maximumFractionDigits?: number
  },
): string {
  const {
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    maximumFractionDigits = 1,
  } = options ?? {}

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits,
  }).format(amount)
}

export function formatPercent(value: number, digits: number = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatDate(value: DateValue, pattern: string = 'MMM d, yyyy'): string {
  const date = parseDateValue(value)
  if (!isValid(date)) return ''
  return format(date, pattern)
}

export function formatDateIntl(
  value: DateValue,
  formatOptions?: Intl.DateTimeFormatOptions,
  locale?: Locale,
): string {
  return formatWithIntl(value, formatOptions, locale)
}

export function formatDateTime(
  value: DateValue,
  formatOptions?: Intl.DateTimeFormatOptions,
  locale?: Locale,
): string {
  return formatWithIntl(value, formatOptions ?? DEFAULT_DATE_TIME_FORMAT, locale)
}

export function formatRelativeDate(value: DateValue, referenceDate?: Date): string {
  const date = parseDateValue(value)
  if (!isValid(date)) return ''
  return formatDistanceToNow(date, {
    addSuffix: true,
    ...(referenceDate ? { baseDate: referenceDate } : {}),
  })
}
