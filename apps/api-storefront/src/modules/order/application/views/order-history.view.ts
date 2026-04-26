import type { OrderSummaryView, OrderStatusView, SubOrderSummaryView } from './order-summary.view'

export type OrderHistoryStatus = OrderStatusView
export type OrderHistorySubOrder = SubOrderSummaryView

/**
 * A single order row returned by `GET /users/me/orders`. Carries the
 * same shape as {@link OrderSummaryView} (order number, status, totals,
 * per-seller suborders with items) plus `createdAt` so buyers can
 * display a timestamped history.
 */
export interface OrderHistoryView extends OrderSummaryView {
  createdAt: string
}

export interface OrderHistoryPage {
  data: OrderHistoryView[]
  page: number
  limit: number
  total: number
  totalPages: number
}
