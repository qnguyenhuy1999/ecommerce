import type { ProductsStatusTab } from './Products.types'

export const PRODUCTS_STATUS_LABELS: Record<ProductsStatusTab, string> = {
  ALL: 'All',
  LIVE: 'Live',
  DRAFT: 'Draft',
  OUT_OF_STOCK: 'Out of stock',
  PENDING: 'Pending',
  BLOCKED: 'Blocked',
  SCHEDULED: 'Scheduled',
}
