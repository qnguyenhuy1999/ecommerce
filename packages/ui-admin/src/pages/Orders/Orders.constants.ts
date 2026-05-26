import type { OrderStatusTab, OrderStatusTabOption } from './Orders.types'

export const ORDERS_STATUS_TAB_ORDER: Array<OrderStatusTab> = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export function buildOrderStatusCounts(statusTabs: OrderStatusTabOption[]): Record<string, number> {
  return statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = tab.count
    return acc
  }, {})
}
