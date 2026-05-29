import { describe, expect, it } from 'vitest'
import { PlatformVoucherStatus, PlatformVoucherType } from '@ecom/database'
import { calculateVoucherDiscount } from './cart.utils'

describe('calculateVoucherDiscount', () => {
  const now = new Date('2026-05-23T00:00:00.000Z')

  it('caps percentage voucher discount by max amount', () => {
    const result = calculateVoucherDiscount(
      200,
      {
        status: PlatformVoucherStatus.ACTIVE,
        type: PlatformVoucherType.PERCENTAGE,
        discountValue: 20,
        maxDiscountAmount: 25,
        minOrderAmount: 100,
        usageLimit: null,
        usedCount: 0,
        startsAt: new Date('2026-05-01T00:00:00.000Z'),
        expiresAt: new Date('2026-06-01T00:00:00.000Z'),
      },
      now,
    )

    expect(result).toEqual({ discountTotal: 25, reason: null })
  })

  it('rejects voucher when minimum order amount is not met', () => {
    const result = calculateVoucherDiscount(
      40,
      {
        status: PlatformVoucherStatus.ACTIVE,
        type: PlatformVoucherType.FIXED_AMOUNT,
        discountValue: 10,
        maxDiscountAmount: null,
        minOrderAmount: 50,
        usageLimit: null,
        usedCount: 0,
        startsAt: new Date('2026-05-01T00:00:00.000Z'),
        expiresAt: new Date('2026-06-01T00:00:00.000Z'),
      },
      now,
    )

    expect(result).toEqual({
      discountTotal: 0,
      reason: 'Cart does not meet minimum order amount',
    })
  })

  it('clamps fixed voucher discount to subtotal', () => {
    const result = calculateVoucherDiscount(
      12,
      {
        status: PlatformVoucherStatus.ACTIVE,
        type: PlatformVoucherType.FIXED_AMOUNT,
        discountValue: 20,
        maxDiscountAmount: null,
        minOrderAmount: null,
        usageLimit: null,
        usedCount: 0,
        startsAt: new Date('2026-05-01T00:00:00.000Z'),
        expiresAt: new Date('2026-06-01T00:00:00.000Z'),
      },
      now,
    )

    expect(result).toEqual({ discountTotal: 12, reason: null })
  })
})
