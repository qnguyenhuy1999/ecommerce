import type { Prisma } from '@prisma/client'

import type { ShippingAddressDto } from '../../application/dtos/create-order.dto'
import type {
  OrderHistoryPage,
  OrderHistoryStatus,
} from '../../application/views/order-history.view'
import type { OrderSummaryView } from '../../application/views/order-summary.view'

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY')

export interface CreateOrderFromCartInput {
  userId: string
  shippingAddress: ShippingAddressDto
  reservationExpiresAt: Date
}

export interface ListOrdersByBuyerInput {
  buyerId: string
  page: number
  limit: number
  sort: 'createdAt'
  order: 'asc' | 'desc'
  status?: OrderHistoryStatus
}

export type OrderTransactionClient = Prisma.TransactionClient

export interface IOrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<OrderSummaryView>
  listByBuyer(input: ListOrdersByBuyerInput): Promise<OrderHistoryPage>
}
