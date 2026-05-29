'use client'

import { useState } from 'react'
import { buildOrderStatusCounts, type OrdersStatusTab } from '@ecom/ui-seller'
import { useOrdersList } from './use-order-queries'
import { mapOrdersToRows, SELLER_ORDER_STATUS_TO_QUERY } from '../mappers'

export function useOrdersAdapter() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrdersStatusTab>('ALL')

  const statusFilter = status === 'ALL' ? undefined : SELLER_ORDER_STATUS_TO_QUERY[status]

  const ordersQuery = useOrdersList({
    page,
    limit: 20,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  })

  const orders = ordersQuery.data?.items ? mapOrdersToRows(ordersQuery.data.items) : []
  const meta = ordersQuery.data?.meta
  const statusCounts = buildOrderStatusCounts(orders)

  return {
    loading: ordersQuery.isPending,
    error: ordersQuery.error,
    orders,
    status,
    onStatusChange: (nextStatus: OrdersStatusTab) => {
      setStatus(nextStatus)
      setPage(1)
    },
    search,
    onSearchChange: (value: string) => {
      setSearch(value)
      setPage(1)
    },
    statusCounts,
    emptyMessage: ordersQuery.isPending ? 'Loading orders...' : 'No orders yet',
    ...(meta ? { meta } : {}),
    onPageChange: setPage,
  }
}
