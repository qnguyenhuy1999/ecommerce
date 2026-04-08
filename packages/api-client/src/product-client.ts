// TODO: implement
import { getApiClient } from './client';
import type { ProductResponse, ProductListRequest } from '@ecom/api-types';

export const productClient = {
  list: async (params?: ProductListRequest) => {
    const { data } = await getApiClient().get<{ success: true; data: ProductResponse[]; meta: unknown }>('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: ProductResponse }>(`/products/${id}`);
    return data.data;
  },
};
