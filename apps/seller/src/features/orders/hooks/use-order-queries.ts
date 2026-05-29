'use client'

import { useQuery } from '@tanstack/react-query'
import { getOrdersList, getOrderDetail } from '../api'
import { orderKeys } from '../query-keys'

export function useOrdersList(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrdersList(params),
  })
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
  })
}
