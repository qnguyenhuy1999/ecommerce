// TODO: implement
import { getApiClient } from './client';
import type { OrderResponse, CheckoutRequest, OrderListRequest } from '@ecom/api-types';

export const orderClient = {
  checkout: async (data: CheckoutRequest): Promise<OrderResponse> => {
    const { data: response } = await getApiClient().post<{ success: true; data: OrderResponse }>('/orders', data);
    return response.data;
  },

  list: async (params?: OrderListRequest) => {
    const { data } = await getApiClient().get<{ success: true; data: OrderResponse[]; meta: unknown }>('/orders', { params });
    return data;
  },

  getById: async (id: string): Promise<OrderResponse> => {
    const { data } = await getApiClient().get<{ success: true; data: OrderResponse }>(`/orders/${id}`);
    return data.data;
  },

  updateStatus: async (id: string, status: string, shippingTracking?: unknown) => {
    const { data } = await getApiClient().patch(`/orders/${id}/status`, { status, shippingTracking });
    return data;
  },

  requestRefund: async (id: string, reason?: string) => {
    const { data } = await getApiClient().post<{ success: true; data: OrderResponse }>(`/orders/${id}/refund`, { reason });
    return data.data;
  },
};
