'use client'

import type { OrderDetailProps } from '@ecom/ui-admin'
import { useOrder } from './use-order-queries'
import { useForceCancelOrder, useForceCompleteOrder } from './use-order-mutations'
import { mapOrderToDetailRecord } from '../mappers/order.mapper'

export function useOrderDetailAdapter(
  id: string,
): OrderDetailProps & { loading: boolean; error: Error | null } {
  const { data, isLoading, error } = useOrder(id)
  const forceCancel = useForceCancelOrder()
  const forceComplete = useForceCompleteOrder()

  return {
    loading: isLoading,
    error,
    ...(data !== undefined ? { order: mapOrderToDetailRecord(data) } : {}),
    onForceCancel: () => forceCancel.mutate({ id }),
    onForceComplete: () => forceComplete.mutate(id),
  }
}
