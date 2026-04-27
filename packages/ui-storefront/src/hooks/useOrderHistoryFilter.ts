import * as React from 'react'

import type { OrderStatus } from '../atoms/OrderStatusBadge/OrderStatusBadge'

export type OrderHistoryTab = 'all' | 'active' | 'completed' | 'cancelled'

export interface OrderHistoryFilterableOrder {
  status: OrderStatus
  orderNumber: string
  items: { title: string }[]
}

export interface UseOrderHistoryFilterOptions<T extends OrderHistoryFilterableOrder> {
  orders: T[]
  tab?: OrderHistoryTab
  searchQuery?: string
  onSearchChange?: (next: string) => void
  dateRange?: string
}

export interface UseOrderHistoryFilterReturn<T extends OrderHistoryFilterableOrder> {
  query: string
  setQuery: (next: string) => void
  visibleOrders: T[]
  isFiltered: boolean
}

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED']
const COMPLETED_STATUSES: OrderStatus[] = ['COMPLETED']
const CANCELLED_STATUSES: OrderStatus[] = ['CANCELLED', 'REFUNDED', 'PENDING_REFUND']

export function useOrderHistoryFilter<T extends OrderHistoryFilterableOrder>({
  orders,
  tab = 'all',
  searchQuery,
  onSearchChange,
  dateRange = 'all',
}: UseOrderHistoryFilterOptions<T>): UseOrderHistoryFilterReturn<T> {
  const [internalQuery, setInternalQuery] = React.useState('')
  const isControlled = searchQuery !== undefined
  const query = isControlled ? (searchQuery as string) : internalQuery

  if (process.env.NODE_ENV !== 'production' && isControlled && !onSearchChange) {
    console.warn(
      '[useOrderHistoryFilter] `searchQuery` was provided without `onSearchChange`. ' +
        'The search input will be frozen because the hook cannot update a controlled value. ' +
        'Either provide `onSearchChange` or omit `searchQuery` to use uncontrolled mode.',
    )
  }

  const setQuery = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalQuery(next)
      onSearchChange?.(next)
    },
    [isControlled, onSearchChange],
  )

  const visibleOrders = React.useMemo(() => {
    let next = orders
    if (tab !== 'all') {
      const allowed: OrderStatus[] =
        tab === 'active'
          ? ACTIVE_STATUSES
          : tab === 'completed'
            ? COMPLETED_STATUSES
            : CANCELLED_STATUSES
      next = next.filter((o) => allowed.includes(o.status))
    }
    const trimmed = query.trim().toLowerCase()
    if (trimmed) {
      next = next.filter((o) => {
        if (o.orderNumber.toLowerCase().includes(trimmed)) return true
        return o.items.some((i) => i.title.toLowerCase().includes(trimmed))
      })
    }
    return next
  }, [orders, tab, query])

  const isFiltered = tab !== 'all' || Boolean(query.trim()) || dateRange !== 'all'

  return { query, setQuery, visibleOrders, isFiltered }
}
