'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  OrderDetail,
  buildOrderDetailStatusActions,
  type OrderDetailRecord,
  type OrderDetailStatus,
} from '@ecom/ui-seller'
import { getOrderDetail, updateOrderStatus } from '@/features/integration/seller-page-api'
import { mapOrderDetail } from '@/features/integration/seller-page-adapters'
import { DashboardLayout } from '../../../components/dashboard-layout'

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetailRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionInFlight, setActionInFlight] = useState<OrderDetailStatus | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)

      try {
        const response = await getOrderDetail(params.id)
        setOrder(response ? mapOrderDetail(response) : null)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    void fetchOrder()
  }, [params.id])

  const statusActions = useMemo(
    () => (order ? buildOrderDetailStatusActions(order.status) : []),
    [order],
  )

  const handleStatusAction = async (nextStatus: OrderDetailStatus) => {
    if (!order) {
      return
    }

    setActionInFlight(nextStatus)

    try {
      await updateOrderStatus(params.id, { status: nextStatus })

      setOrder((current) =>
        current
          ? {
              ...current,
              status: nextStatus,
              updatedAt: formatDateTime(new Date().toISOString()),
              auditLogs: [
                {
                  id: `local-${Date.now()}`,
                  label: `${current.status} -> ${nextStatus}`,
                  timestamp: formatDateTime(new Date().toISOString()),
                },
                ...(current.auditLogs ?? []),
              ],
            }
          : current,
      )
    } finally {
      setActionInFlight(null)
    }
  }

  return (
    <DashboardLayout>
      <OrderDetail
        title="Order detail"
        description="Review items, buyer information, and update fulfillment progress."
        breadcrumb={[
          { label: 'Orders', href: '/orders' },
          ...(order ? [{ label: order.orderNumber }] : [{ label: params.id }]),
        ]}
        backHref="/orders"
        order={order}
        loading={loading}
        statusActions={statusActions}
        actionInFlight={actionInFlight}
        onStatusAction={handleStatusAction}
        emptyMessage="We couldn't find this order."
      />
    </DashboardLayout>
  )
}
