import { ordersColumns } from './Orders.columns'
import { ORDERS_STATUS_LABELS } from './Orders.constants'
import { orderStatusTabs } from './Orders.fixtures'
import type { OrderRow, OrdersFilterParams, OrdersStatusTab } from './Orders.types'

export { ordersColumns }

export function getOrdersStatusLabel(status: OrdersStatusTab) {
  return ORDERS_STATUS_LABELS[status]
}

export function isOrdersStatusTab(value: string): value is OrdersStatusTab {
  return orderStatusTabs.some((tab) => tab === value)
}

export function buildOrderStatusCounts(orders: OrderRow[]): Record<OrdersStatusTab, number> {
  const counts: Record<OrdersStatusTab, number> = {
    ALL: 0,
    TO_PAY: 0,
    TO_SHIP: 0,
    PACKING: 0,
    SHIPPING: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  }

  for (const order of orders) {
    counts.ALL += 1
    counts[order.status] += 1
  }

  return counts
}

export function filterOrdersBySearchAndStatus({
  orders,
  search,
  status,
}: OrdersFilterParams): OrderRow[] {
  const query = search.trim().toLowerCase()

  return orders.filter((order) => {
    const matchesStatus = status === 'ALL' || order.status === status
    const matchesSearch =
      query.length === 0 ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.buyerName.toLowerCase().includes(query) ||
      order.items.some((item) => item.productName.toLowerCase().includes(query))

    return matchesStatus && matchesSearch
  })
}
