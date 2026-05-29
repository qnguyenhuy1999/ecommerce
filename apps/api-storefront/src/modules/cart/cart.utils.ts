import { PlatformVoucherStatus, PlatformVoucherType } from '@ecom/database'

export type VoucherCalculationInput = {
  status: PlatformVoucherStatus
  type: PlatformVoucherType
  discountValue: number
  maxDiscountAmount: number | null
  minOrderAmount: number | null
  usageLimit: number | null
  usedCount: number
  startsAt: Date
  expiresAt: Date
}

export type VoucherCalculationResult = {
  discountTotal: number
  reason: string | null
}

export function calculateVoucherDiscount(
  subtotal: number,
  voucher: VoucherCalculationInput,
  now: Date,
): VoucherCalculationResult {
  if (voucher.status !== PlatformVoucherStatus.ACTIVE) {
    return { discountTotal: 0, reason: 'Voucher is not active' }
  }

  if (voucher.startsAt > now || voucher.expiresAt < now) {
    return { discountTotal: 0, reason: 'Voucher is expired or not started yet' }
  }

  if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
    return { discountTotal: 0, reason: 'Voucher usage limit reached' }
  }

  if (voucher.minOrderAmount !== null && subtotal < voucher.minOrderAmount) {
    return { discountTotal: 0, reason: 'Cart does not meet minimum order amount' }
  }

  if (subtotal <= 0) {
    return { discountTotal: 0, reason: 'Cart is empty' }
  }

  switch (voucher.type) {
    case PlatformVoucherType.PERCENTAGE: {
      const rawDiscount = (subtotal * voucher.discountValue) / 100
      const cappedDiscount =
        voucher.maxDiscountAmount !== null
          ? Math.min(rawDiscount, voucher.maxDiscountAmount)
          : rawDiscount
      return { discountTotal: roundMoney(Math.min(cappedDiscount, subtotal)), reason: null }
    }
    case PlatformVoucherType.FIXED_AMOUNT:
      return { discountTotal: roundMoney(Math.min(voucher.discountValue, subtotal)), reason: null }
    case PlatformVoucherType.FREE_SHIPPING:
      return { discountTotal: 0, reason: null }
  }
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}
