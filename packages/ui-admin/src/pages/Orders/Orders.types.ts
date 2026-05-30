import type { PaginationMeta } from '@ecom/shared/pagination/core/types'

export const orderStatuses = [
  'PENDING',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const

export type OrderStatus = (typeof orderStatuses)[number]
export type OrderStatusTab = 'ALL' | OrderStatus

export interface OrderRecord {
  id: string
  status: OrderStatus
  totalAmountLabel: string
  sellerCount: number
  itemCount: number
  createdAtLabel: string
}

export interface OrderStatusTabOption {
  value: OrderStatusTab
  label: string
  count: number
}

export interface OrdersProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  viewLabel?: string
  emptyMessage?: string
  statusTabs?: OrderStatusTabOption[]
  items?: OrderRecord[]
  loading?: boolean
  meta?: PaginationMeta
  activeStatus?: OrderStatusTab
  onView?: (item: OrderRecord) => void
  onSearchChange?: (search: string) => void
  onStatusChange?: (status: OrderStatusTab) => void
  onPageChange?: (page: number) => void
}
