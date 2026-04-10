import { z } from 'zod'

export const CreatePaymentIntentRequestSchema = z.object({
  orderId: z.string().min(1),
})

export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequestSchema>

export const PaymentIntentResponseSchema = z.object({
  clientSecret: z.string(),
  paymentIntentId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']),
})

export type PaymentIntentResponse = z.infer<typeof PaymentIntentResponseSchema>

export const WebhookPayloadSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
})

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>
