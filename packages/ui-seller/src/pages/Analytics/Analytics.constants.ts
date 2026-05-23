export const ANALYTICS_CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return ANALYTICS_CURRENCY_FORMATTER.format(value)
}
