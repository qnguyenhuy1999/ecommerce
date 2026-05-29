import { CouponScope, CouponStatus, CouponType } from '@ecom/contracts/enums'
import type { FactoryOverrides } from './types'

export interface TestCoupon {
  id: string
  shopId: string
  code: string
  type: CouponType
  scope: CouponScope
  status: CouponStatus
  discountValue: number
}

export function createCouponFactory(overrides: FactoryOverrides<TestCoupon> = {}): TestCoupon {
  return {
    id: 'coupon-1',
    shopId: 'shop-1',
    code: 'TEST10',
    type: CouponType.PERCENTAGE,
    scope: CouponScope.ALL_PRODUCTS,
    status: CouponStatus.ACTIVE,
    discountValue: 10,
    ...overrides,
  }
}
