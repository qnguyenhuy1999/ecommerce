'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { forceCancelOrder, forceCompleteOrder } from '../api/orders.api'

function useInvalidateOrders() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['orders'] })
    void qc.invalidateQueries({ queryKey: ['order'] })
    void qc.invalidateQueries({ queryKey: ['order-status-counts'] })
  }
}

export function useForceCancelOrder() {
  const invalidate = useInvalidateOrders()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => forceCancelOrder(id, reason),
    onSuccess: invalidate,
  })
}

export function useForceCompleteOrder() {
  const invalidate = useInvalidateOrders()
  return useMutation({ mutationFn: forceCompleteOrder, onSuccess: invalidate })
}
