export interface FormatPriceOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const DEFAULT_LOCALE = 'en-US'
const DEFAULT_CURRENCY = 'USD'

export function formatPrice(value: number, options: FormatPriceOptions = {}): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

export function clampQuantity(value: number, min = 1, max = 99): number {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(Math.max(Math.trunc(value), min), max)
}

export function calculateDiscountPercent(originalPrice: number, finalPrice: number): number {
  if (originalPrice <= 0 || finalPrice >= originalPrice) {
    return 0
  }

  const discount = ((originalPrice - finalPrice) / originalPrice) * 100
  return Math.round(discount)
}
