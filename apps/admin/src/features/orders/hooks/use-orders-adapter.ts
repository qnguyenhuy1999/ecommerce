'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OrderRecord, OrdersProps, OrderStatusTab } from '@ecom/ui-admin/pages/Orders'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core/constants'
import { useOrders, useOrderStatusCounts } from './use-order-queries'
import { buildOrderStatusTabs, mapOrderToRecord } from '../mappers/order.mapper'

export function useOrdersAdapter(): OrdersProps & { loading: boolean; error: Error | null } {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState<OrderStatusTab>('ALL')

  const ordersQuery = useOrders({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    ...(search ? { search } : {}),
    ...(activeStatus !== 'ALL' ? { status: activeStatus } : {}),
  })
  const countsQuery = useOrderStatusCounts()

  const meta = ordersQuery.data?.meta

  return {
    loading: ordersQuery.isPending,
    error: ordersQuery.error,
    items: (ordersQuery.data?.items ?? []).map(mapOrderToRecord),
    statusTabs: buildOrderStatusTabs(countsQuery.data ?? {}),
    ...(meta !== undefined ? { meta } : {}),
    activeStatus,
    onSearchChange: (value: string) => {
      setSearch(value)
      setPage(1)
    },
    onStatusChange: (status: OrderStatusTab) => {
      setActiveStatus(status)
      setPage(1)
    },
    onPageChange: setPage,
    onView: (item: OrderRecord) => router.push(`/orders/${item.id}`),
  }
}
