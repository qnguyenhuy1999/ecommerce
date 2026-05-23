import type { OrdersStatusTab } from './Orders.types'

export const ORDERS_STATUS_LABELS: Record<OrdersStatusTab, string> = {
  ALL: 'All',
  TO_PAY: 'To pay',
  TO_SHIP: 'To ship',
  PACKING: 'Packing',
  SHIPPING: 'Shipping',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const ORDERS_STATUS_BADGE_STYLES: Record<Exclude<OrdersStatusTab, 'ALL'>, string> = {
  TO_PAY: 'bg-warning/10 text-warning',
  TO_SHIP: 'bg-info/10 text-info',
  PACKING: 'bg-primary-soft text-primary-deep',
  SHIPPING: 'bg-accent text-accent-foreground',
  COMPLETED: 'bg-success/10 text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
}
