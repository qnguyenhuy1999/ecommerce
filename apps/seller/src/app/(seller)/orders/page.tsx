'use client'

import { useEffect, useState } from 'react'
import {
  Orders,
  buildOrderStatusCounts,
  type OrderRow,
  type OrdersStatusTab,
} from '@ecom/ui-seller'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { getOrdersList } from '@/features/orders/api'
import { mapOrdersToRows, SELLER_ORDER_STATUS_TO_QUERY } from '@/features/orders/mappers'

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrdersStatusTab>('ALL')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<PaginationMeta | undefined>()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const statusFilter = status === 'ALL' ? undefined : SELLER_ORDER_STATUS_TO_QUERY[status]
        const response = await getOrdersList({
          page,
          limit: 20,
          ...(search ? { search } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        })

        setOrders(mapOrdersToRows(response.items))
        setMeta(response.meta)
      } catch {
        setOrders([])
        setMeta(undefined)
      } finally {
        setLoading(false)
      }
    }

    void fetchOrders()
  }, [page, search, status])

  const statusCounts = buildOrderStatusCounts(orders)

  return (
    <Orders
      loading={loading}
      orders={orders}
      status={status}
      onStatusChange={(nextStatus) => {
        setStatus(nextStatus)
        setPage(1)
      }}
      search={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      statusCounts={statusCounts}
      emptyMessage={loading ? 'Loading orders...' : 'No orders yet'}
      {...(meta ? { meta } : {})}
      onPageChange={setPage}
    />
  )
}
