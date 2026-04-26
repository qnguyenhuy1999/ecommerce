import type { OrderResponse, CheckoutRequest, OrderListRequest } from '@ecom/api-types'

import { getApiClient } from './client'

interface OrderListEnvelope {
  success: true
  data: OrderResponse[]
  meta: unknown
}

export const orderClient = {
  checkout: async (data: CheckoutRequest, idempotencyKey: string): Promise<OrderResponse> => {
    const { data: response } = await getApiClient().post<{ success: true; data: OrderResponse }>(
      '/orders',
      data,
      { headers: { 'Idempotency-Key': idempotencyKey } },
    )
    return response.data
  },

  list: async (params?: OrderListRequest): Promise<OrderListEnvelope> => {
    const { data } = await getApiClient().get<OrderListEnvelope>('/users/me/orders', { params })
    return data
  },

  getById: async (id: string): Promise<OrderResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: OrderResponse }>(
      `/orders/${id}`,
    )
    return data.data
  },

  updateStatus: async (
    id: string,
    status: string,
    shippingTracking?: unknown,
  ): Promise<unknown> => {
    const { data } = await getApiClient().patch<unknown>(`/orders/${id}/status`, {
      status,
      shippingTracking,
    })
    return data
  },

  requestRefund: async (id: string, reason?: string) => {
    const { data } = await getApiClient().post<{ success: true; data: OrderResponse }>(
      `/orders/${id}/refund`,
      { reason },
    )
    return data.data
  },
}
