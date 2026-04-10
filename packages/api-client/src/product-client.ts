// TODO: implement
import type { ProductResponse, ProductListRequest } from '@ecom/api-types'
import { getApiClient } from './client'

export const productClient = {
  list: async (params?: ProductListRequest) => {
    const { data } = await getApiClient().get<{
      success: true
      data: ProductResponse[]
      meta: unknown
    }>('/products', { params })
    return data
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: ProductResponse }>(
      `/products/${id}`,
    )
    return data.data
  },
}
