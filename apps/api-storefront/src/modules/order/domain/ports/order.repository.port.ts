import type { Prisma } from '@prisma/client'

import type { ShippingAddressDto } from '../../application/dtos/create-order.dto'
import type { OrderSummaryView } from '../../application/views/order-summary.view'

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY')

export interface CreateOrderFromCartInput {
  userId: string
  shippingAddress: ShippingAddressDto
  reservationExpiresAt: Date
}

export type OrderTransactionClient = Prisma.TransactionClient

export interface IOrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<OrderSummaryView>
}
