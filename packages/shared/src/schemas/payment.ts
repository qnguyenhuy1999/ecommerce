import { z } from 'zod'

import { paginationParamsSchema } from '../pagination'

export const paymentStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

export const paymentMethodSchema = z.enum(['STRIPE', 'COD', 'WALLET'])

export const paymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  status: paymentStatusSchema,
  method: paymentMethodSchema,
  stripePaymentIntentId: z.string().nullable(),
  stripeSessionId: z.string().nullable(),
  metadata: z.record(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createStripePaymentSchema = z.object({
  orderId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
})

export const paymentListParamsSchema = paginationParamsSchema.extend({
  orderId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: paymentStatusSchema.optional(),
})

export type Payment = z.infer<typeof paymentSchema>
export type CreateStripePaymentInput = z.infer<typeof createStripePaymentSchema>
export type PaymentListParams = z.infer<typeof paymentListParamsSchema>
