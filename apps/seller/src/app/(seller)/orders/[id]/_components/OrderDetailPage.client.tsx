'use client'

import { OrderDetail } from '@ecom/ui-seller/pages/OrderDetail'
import { useOrderDetailAdapter } from '@/features/orders/hooks/use-order-detail-adapter'

type OrderDetailPageClientProps = {
  orderId: string
  initialData?: Parameters<typeof useOrderDetailAdapter>[1]
}

export function OrderDetailPageClient({ orderId, initialData }: OrderDetailPageClientProps) {
  const {
    loading,
    order,
    statusActions,
    actionInFlight,
    onStatusAction,
    backHref,
    breadcrumb,
    emptyMessage,
  } = useOrderDetailAdapter(orderId, initialData)

  return (
    <OrderDetail
      title="Order detail"
      description="Review items, buyer information, and update fulfillment progress."
      breadcrumb={breadcrumb}
      backHref={backHref}
      order={order}
      loading={loading}
      statusActions={statusActions}
      actionInFlight={actionInFlight}
      onStatusAction={onStatusAction}
      emptyMessage={emptyMessage}
    />
  )
}
