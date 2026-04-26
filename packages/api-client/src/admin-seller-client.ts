import type {
  AdminRejectSellerRequest,
  AdminSellerDetail,
  AdminSellerListRequest,
  AdminSellerSummary,
} from '@ecom/api-types'

import { getApiClient } from './client'

interface ListMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const adminSellerClient = {
  list: async (
    params?: AdminSellerListRequest,
  ): Promise<{ data: AdminSellerSummary[]; meta: ListMeta }> => {
    const { data } = await getApiClient().get<{
      success: true
      data: AdminSellerSummary[]
      meta: ListMeta
    }>('/admin/sellers', { params })
    return { data: data.data, meta: data.meta }
  },

  getById: async (id: string): Promise<AdminSellerDetail> => {
    const { data } = await getApiClient().get<{ success: true; data: AdminSellerDetail }>(
      `/admin/sellers/${id}`,
    )
    return data.data
  },

  approve: async (id: string): Promise<void> => {
    await getApiClient().patch(`/admin/sellers/${id}/approve`)
  },

  reject: async (id: string, payload: AdminRejectSellerRequest): Promise<void> => {
    await getApiClient().patch(`/admin/sellers/${id}/reject`, payload)
  },
}
