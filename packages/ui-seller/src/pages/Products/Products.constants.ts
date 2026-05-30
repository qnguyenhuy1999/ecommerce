import type { ProductsStatusTab } from './Products.types'

export const PRODUCT_STATUS_TABS = [
  'ALL',
  'LIVE',
  'DRAFT',
  'OUT_OF_STOCK',
  'PENDING',
  'BLOCKED',
  'SCHEDULED',
] as const satisfies readonly ProductsStatusTab[]

export const PRODUCTS_STATUS_LABELS: Record<ProductsStatusTab, string> = {
  ALL: 'All',
  LIVE: 'Live',
  DRAFT: 'Draft',
  OUT_OF_STOCK: 'Out of stock',
  PENDING: 'Pending',
  BLOCKED: 'Blocked',
  SCHEDULED: 'Scheduled',
}
