import type {
  AdminOrderDetail,
  AdminOrderListRequest,
  AdminOrderSummary,
  AdminUpdateOrderStatusRequest,
  AdminUpdateSubOrderStatusRequest,
} from '@ecom/api-types'

import { getApiClient } from './client'

interface ListMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const adminOrderClient = {
  list: async (
    params?: AdminOrderListRequest,
  ): Promise<{ data: AdminOrderSummary[]; meta: ListMeta }> => {
    const { data } = await getApiClient().get<{
      success: true
      data: AdminOrderSummary[]
      meta: ListMeta
    }>('/admin/orders', { params })
    return { data: data.data, meta: data.meta }
  },

  getById: async (id: string): Promise<AdminOrderDetail> => {
    const { data } = await getApiClient().get<{ success: true; data: AdminOrderDetail }>(
      `/admin/orders/${id}`,
    )
    return data.data
  },

  updateStatus: async (
    id: string,
    payload: AdminUpdateOrderStatusRequest,
  ): Promise<AdminOrderDetail> => {
    const { data } = await getApiClient().patch<{ success: true; data: AdminOrderDetail }>(
      `/admin/orders/${id}/status`,
      payload,
    )
    return data.data
  },

  updateSubOrderStatus: async (
    subOrderId: string,
    payload: AdminUpdateSubOrderStatusRequest,
  ): Promise<AdminOrderDetail> => {
    const { data } = await getApiClient().patch<{ success: true; data: AdminOrderDetail }>(
      `/admin/orders/sub-orders/${subOrderId}/status`,
      payload,
    )
    return data.data
  },
}
