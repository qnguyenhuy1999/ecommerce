import type { CreateProductRequest, ProductListRequest, ProductResponse, UpdateProductRequest } from '@ecom/api-types'

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

  create: async (input: CreateProductRequest): Promise<ProductResponse> => {
    const { data } = await getApiClient().post<{ success: true; data: ProductResponse }>(
      '/products',
      input,
    )
    return data.data
  },

  update: async (id: string, input: UpdateProductRequest): Promise<ProductResponse> => {
    const { data } = await getApiClient().patch<{ success: true; data: ProductResponse }>(
      `/products/${id}`,
      input,
    )
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await getApiClient().delete(`/products/${id}`)
  },
}
