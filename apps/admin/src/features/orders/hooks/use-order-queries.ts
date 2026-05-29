'use client'

import { useQuery } from '@tanstack/react-query'
import { getOrders, getOrder, getOrderStatusCounts, type OrderListQuery } from '../api/orders.api'

export function useOrders(params: OrderListQuery) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const res = await getOrders(params)
      return res.data
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getOrder(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useOrderStatusCounts() {
  return useQuery({
    queryKey: ['order-status-counts'],
    queryFn: async () => {
      const res = await getOrderStatusCounts()
      return res.data
    },
  })
}
