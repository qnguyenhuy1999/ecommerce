import type { CreatePaymentIntentRequest, PaymentIntentResponse } from '@ecom/api-types'

import { getApiClient } from './client'

export const paymentClient = {
  createIntent: async (
    data: CreatePaymentIntentRequest,
    idempotencyKey: string,
  ): Promise<PaymentIntentResponse> => {
    const { data: response } = await getApiClient().post<{
      success: true
      data: PaymentIntentResponse
    }>(
      '/payments/intent',
      { ...data, paymentMethod: 'stripe', idempotencyKey },
      { headers: { 'Idempotency-Key': idempotencyKey } },
    )
    return response.data
  },

  refund: async (
    orderId: string,
    data: { amount?: number; reason?: string },
    idempotencyKey: string,
  ) => {
    const { data: response } = await getApiClient().post<{
      success: true
      data: { orderId: string; paymentId: string; refundId: string; status: string; amount: number }
    }>(`/payments/orders/${orderId}/refund`, data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    return response.data
  },
}
