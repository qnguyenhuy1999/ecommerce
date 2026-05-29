'use client'

import { Orders } from '@ecom/ui-seller/pages/Orders'
import { useOrdersAdapter } from '@/features/orders/hooks/use-orders-adapter'

export default function OrdersPage() {
  const {
    loading,
    orders,
    status,
    onStatusChange,
    search,
    onSearchChange,
    statusCounts,
    emptyMessage,
    meta,
    onPageChange,
  } = useOrdersAdapter()

  return (
    <Orders
      loading={loading}
      orders={orders}
      status={status}
      onStatusChange={onStatusChange}
      search={search}
      onSearchChange={onSearchChange}
      statusCounts={statusCounts}
      emptyMessage={emptyMessage}
      {...(meta ? { meta } : {})}
      onPageChange={onPageChange}
    />
  )
}
