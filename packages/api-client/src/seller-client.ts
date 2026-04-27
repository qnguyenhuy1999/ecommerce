import type { KycSubmitRequest, SellerResponse, UpdateSellerRequest } from '@ecom/api-types'

import { getApiClient } from './client'

export const sellerClient = {
  register: async (input: KycSubmitRequest): Promise<SellerResponse> => {
    const { data } = await getApiClient().post<{ success: true; data: SellerResponse }>(
      '/sellers/register',
      input,
    )
    return data.data
  },

  get: async (id: string): Promise<SellerResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: SellerResponse }>(
      `/sellers/${id}`,
    )
    return data.data
  },

  update: async (id: string, input: UpdateSellerRequest): Promise<SellerResponse> => {
    const { data } = await getApiClient().patch<{ success: true; data: SellerResponse }>(
      `/sellers/${id}`,
      input,
    )
    return data.data
  },
}
