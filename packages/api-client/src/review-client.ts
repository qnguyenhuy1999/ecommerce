import { getApiClient } from './client'

export interface ReviewResponse {
  id: string
  orderId: string
  sellerId: string
  productId: string
  userId: string
  rating: number
  comment: string | null
  createdAt: string
}

export const reviewClient = {
  list: async (params?: { productId?: string }): Promise<ReviewResponse[]> => {
    const { data } = await getApiClient().get<{ success: true; data: ReviewResponse[] }>('/reviews', { params })
    return data.data
  },

  create: async (input: { orderId: string; productId: string; rating: number; comment?: string }): Promise<ReviewResponse> => {
    const { data } = await getApiClient().post<{ success: true; data: ReviewResponse }>('/reviews', input)
    return data.data
  },
}
