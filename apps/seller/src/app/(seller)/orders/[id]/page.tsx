'use client'

import { OrderDetail } from '@ecom/ui-seller'
import { useOrderDetailAdapter } from '@/features/orders/hooks/use-order-detail-adapter'

export default function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const { loading, order, statusActions, actionInFlight, onStatusAction, backHref, breadcrumb, emptyMessage } =
    useOrderDetailAdapter(params.id)

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
