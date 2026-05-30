import { ShopStatus } from '@ecom/contracts/enums/seller'
import type { FactoryOverrides } from './types'

export interface TestShop {
  id: string
  sellerId: string
  name: string
  slug: string
  status: ShopStatus
}

export function createShopFactory(overrides: FactoryOverrides<TestShop> = {}): TestShop {
  return {
    id: 'shop-1',
    sellerId: 'seller-1',
    name: 'Test Shop',
    slug: 'test-shop',
    status: ShopStatus.ACTIVE,
    ...overrides,
  }
}
