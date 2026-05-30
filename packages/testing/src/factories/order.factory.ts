import { OrderStatus } from '@ecom/contracts/enums/order'
import type { FactoryOverrides } from './types'

export interface TestOrder {
  id: string
  userId: string
  status: OrderStatus
  totalAmount: number
}

export function createOrderFactory(overrides: FactoryOverrides<TestOrder> = {}): TestOrder {
  return {
    id: 'order-1',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    totalAmount: 100,
    ...overrides,
  }
}
