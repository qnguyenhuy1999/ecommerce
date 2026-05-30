import { SellerStatus } from '@ecom/contracts/enums/seller'
import type { FactoryOverrides } from './types'

export interface TestSeller {
  id: string
  userId: string
  shopId: string
  status: SellerStatus
}

export function createSellerFactory(overrides: FactoryOverrides<TestSeller> = {}): TestSeller {
  return {
    id: 'seller-1',
    userId: 'user-1',
    shopId: 'shop-1',
    status: SellerStatus.ACTIVE,
    ...overrides,
  }
}
