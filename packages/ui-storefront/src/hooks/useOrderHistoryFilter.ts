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
  /** Coarse status intent. Defaults to 'all'. */
  tab?: OrderHistoryTab
  /** Optional controlled search query. When omitted, the hook manages its own. */
  searchQuery?: string
  /** Date-range key. The hook itself does not filter by date (consumer-driven), but tracks the value for `isFiltered`. */
  dateRange?: string
}

export interface UseOrderHistoryFilterReturn<T extends OrderHistoryFilterableOrder> {
  /** Current effective query — controlled value if provided, otherwise internal state. */
  query: string
  /** Update the query. Emits the new value through the consumer's `onSearchChange` if controlled. */
  setQuery: (next: string) => void
  /** Filtered orders matching the active tab + query. */
  visibleOrders: T[]
  /** True when any filter (tab, query, dateRange) deviates from defaults. */
  isFiltered: boolean
}

const ACTIVE_STATUSES: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED']
const COMPLETED_STATUSES: OrderStatus[] = ['COMPLETED']
const CANCELLED_STATUSES: OrderStatus[] = ['CANCELLED', 'REFUNDED', 'PENDING_REFUND']

/**
 * Pure UI-state hook for the Order History page. Owns the search-query state
 * (uncontrolled fallback), exposes the derived filtered list, and computes the
 * `isFiltered` flag used to switch the empty-state copy. Keeping this here
 * means the layout component stays presentational.
 */
export function useOrderHistoryFilter<T extends OrderHistoryFilterableOrder>({
  orders,
  tab = 'all',
  searchQuery,
  dateRange = 'all',
}: UseOrderHistoryFilterOptions<T>): UseOrderHistoryFilterReturn<T> {
  const [internalQuery, setInternalQuery] = React.useState('')
  const query = searchQuery ?? internalQuery

  const setQuery = React.useCallback(
    (next: string) => {
      if (searchQuery === undefined) setInternalQuery(next)
    },
    [searchQuery],
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
