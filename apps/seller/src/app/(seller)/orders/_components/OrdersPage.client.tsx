'use client'

import { Orders } from '@ecom/ui-seller/pages/Orders'
import { useOrdersAdapter } from '@/features/orders/hooks/use-orders-adapter'

type OrdersPageClientProps = { initialData?: Parameters<typeof useOrdersAdapter>[0] }

export function OrdersPageClient({ initialData }: OrdersPageClientProps) {
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
  } = useOrdersAdapter(initialData)

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
