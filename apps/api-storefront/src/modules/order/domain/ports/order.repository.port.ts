import type { Prisma } from '@prisma/client'

import type { ShippingAddressDto } from '../../application/dtos/create-order.dto'
import type {
  AdminOrderDetailView,
  AdminOrderListInput,
  AdminOrderListPage,
  AdminOrderShippingTracking,
} from '../../application/views/admin-order.view'
import type {
  OrderHistoryPage,
  OrderHistoryStatus,
} from '../../application/views/order-history.view'
import type { OrderStatusView, OrderSummaryView } from '../../application/views/order-summary.view'

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

export interface AdminOrderStatusTransitionInput {
  orderId: string
  toStatus: OrderStatusView
  adminUserId: string
}

export interface AdminSubOrderStatusTransitionInput {
  subOrderId: string
  toStatus: OrderStatusView
  adminUserId: string
  shippingTracking?: AdminOrderShippingTracking
}

export type OrderTransactionClient = Prisma.TransactionClient

export interface IOrderRepository {
  createFromCart(input: CreateOrderFromCartInput): Promise<OrderSummaryView>
  listByBuyer(input: ListOrdersByBuyerInput): Promise<OrderHistoryPage>
  /** Paginated cross-seller view of orders for the admin operations console. */
  listForAdmin(input: AdminOrderListInput): Promise<AdminOrderListPage>
  /** Full order + sub-order detail with seller and item snapshots. */
  findByIdForAdmin(orderId: string): Promise<AdminOrderDetailView | null>
  /** Atomically transition the top-level order status with admin actor audit. */
  transitionOrderStatus(input: AdminOrderStatusTransitionInput): Promise<AdminOrderDetailView>
  /** Atomically transition a single sub-order status (and optional tracking). */
  transitionSubOrderStatus(
    input: AdminSubOrderStatusTransitionInput,
  ): Promise<AdminOrderDetailView>
}
