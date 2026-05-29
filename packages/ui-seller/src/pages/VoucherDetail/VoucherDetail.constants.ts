import { formatDateIntl } from '@ecom/shared'
import type { VoucherDetailType } from './VoucherDetail.types'

export const voucherTypeOptions: Array<{ value: VoucherDetailType; label: string }> = [
  { value: 'PERCENT', label: 'Percent off' },
  { value: 'AMOUNT', label: 'Amount off' },
  { value: 'FREESHIP', label: 'Free shipping' },
]

export function normalizeVoucherCode(code: string) {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 16)
}

export function generateVoucherCode() {
  const cryptoObj = globalThis.crypto
  const random = cryptoObj.getRandomValues(new Uint32Array(1))[0]

  if (random) {
    return `SHOP${random.toString(36).toUpperCase().slice(0, 6)}`
  }

  const array = new Uint8Array(6)
  return `SHOP${Array.from(array)
    .map((x) => (x % 36).toString(36).toUpperCase())
    .join('')}`
}

export function formatDateLabel(value: string) {
  if (!value) {
    return 'No expiry'
  }

  const label = formatDateIntl(value, { month: 'short', day: 'numeric' }, 'en-US')
  if (!label) {
    return 'No expiry'
  }

  return label
}

export function getPreviewHeadline(type: VoucherDetailType, value: string) {
  if (type === 'FREESHIP') {
    return 'Free shipping'
  }

  const amount = value.trim() || '0'
  return type === 'PERCENT' ? `${amount}% off` : `$${amount} off`
}

export function getTypeValueInputLabel(type: VoucherDetailType) {
  switch (type) {
    case 'PERCENT':
      return 'Value *'
    case 'AMOUNT':
      return 'Amount off (USD) *'
    case 'FREESHIP':
      return 'Value'
  }
}
