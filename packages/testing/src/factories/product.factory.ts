import { ProductStatus } from '@ecom/contracts/enums'
import type { FactoryOverrides } from './types'

export interface TestProduct {
  id: string
  shopId: string
  name: string
  slug: string
  status: ProductStatus
  price: number
  stock: number
}

export function createProductFactory(overrides: FactoryOverrides<TestProduct> = {}): TestProduct {
  return {
    id: 'product-1',
    shopId: 'shop-1',
    name: 'Test Product',
    slug: 'test-product',
    status: ProductStatus.PUBLISHED,
    price: 100,
    stock: 10,
    ...overrides,
  }
}
