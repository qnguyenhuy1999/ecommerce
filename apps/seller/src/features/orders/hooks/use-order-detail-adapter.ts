'use client'

import { useMemo, useState } from 'react'
import { formatDateTime } from '@ecom/shared'
import {
  buildOrderDetailStatusActions,
  type OrderDetailRecord,
  type OrderDetailStatus,
} from '@ecom/ui-seller'
import { getOrderDetail, updateOrderStatus } from '../api'
import { mapOrderDetail } from '../mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderKeys } from '../query-keys'

export function useOrderDetailAdapter(
  orderId: string,
  initialData?: ReturnType<typeof mapOrderDetail> | null,
) {
  const queryClient = useQueryClient()
  const [actionInFlight, setActionInFlight] = useState<OrderDetailStatus | null>(null)

  const query = useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const response = await getOrderDetail(orderId)
      return response ? mapOrderDetail(response) : null
    },
    enabled: !!orderId,
    initialData: initialData ?? undefined,
  })

  const statusMutation = useMutation({
    mutationFn: ({ nextStatus }: { nextStatus: OrderDetailStatus }) =>
      updateOrderStatus(orderId, { status: nextStatus }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(orderKeys.detail(orderId), (old: OrderDetailRecord | null) => {
        if (!old) return old
        return {
          ...old,
          status: variables.nextStatus,
          updatedAt: formatDateTime(
            new Date().toISOString(),
            { dateStyle: 'medium', timeStyle: 'short' },
            'en-US',
          ),
          auditLogs: [
            {
              id: `local-${Date.now()}`,
              label: `${old.status} -> ${variables.nextStatus}`,
              timestamp: formatDateTime(
                new Date().toISOString(),
                { dateStyle: 'medium', timeStyle: 'short' },
                'en-US',
              ),
            },
            ...(old.auditLogs ?? []),
          ],
        }
      })
    },
  })

  const order = query.data as OrderDetailRecord | null

  const statusActions = useMemo(
    () => (order ? buildOrderDetailStatusActions(order.status) : []),
    [order],
  )

  const handleStatusAction = async (nextStatus: OrderDetailStatus) => {
    setActionInFlight(nextStatus)
    try {
      await statusMutation.mutateAsync({ nextStatus })
    } finally {
      setActionInFlight(null)
    }
  }

  return {
    loading: query.isPending,
    error: query.error,
    order,
    statusActions,
    actionInFlight,
    onStatusAction: handleStatusAction,
    backHref: '/orders',
    breadcrumb: [
      { label: 'Orders', href: '/orders' },
      ...(order ? [{ label: order.orderNumber }] : [{ label: orderId }]),
    ],
    emptyMessage: "We couldn't find this order.",
  }
}
