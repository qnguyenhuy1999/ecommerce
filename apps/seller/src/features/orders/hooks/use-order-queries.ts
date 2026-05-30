'use client'

import { useQuery } from '@tanstack/react-query'
import { getOrdersList, getOrderDetail } from '../api'
import { orderKeys } from '../query-keys'

export function useOrdersList(
  params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  },
  options?: { initialData?: Awaited<ReturnType<typeof getOrdersList>> },
) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrdersList(params),
    initialData: options?.initialData,
  })
}

export function useOrderDetail(
  orderId: string,
  options?: { initialData?: Awaited<ReturnType<typeof getOrderDetail>> | null },
) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
    initialData: options?.initialData ?? undefined,
  })
}
