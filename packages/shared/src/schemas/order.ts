import { z } from 'zod'

import { paginationParamsSchema } from '../pagination'

export const orderStatusSchema = z.enum([
  'PENDING_PAYMENT',
  'PAYMENT_VERIFIED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUND_REQUESTED',
  'REFUNDED',
])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const paymentStatusEnum = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
export type PaymentStatusEnum = z.infer<typeof paymentStatusEnum>

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  productImage: z.string().url().nullable(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  sellerId: z.string().uuid(),
})

export const shippingAddressSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().default('VN'),
})

export const orderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  buyerId: z.string().uuid(),
  status: orderStatusSchema,
  items: z.array(orderItemSchema),
  subtotal: z.number().positive(),
  shippingFee: z.number().min(0),
  taxAmount: z.number().min(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['STRIPE', 'COD', 'WALLET']),
  paymentStatus: paymentStatusEnum,
  trackingNumber: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['STRIPE', 'COD', 'WALLET']),
  notes: z.string().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
})

export const orderListParamsSchema = paginationParamsSchema.extend({
  status: orderStatusSchema.optional(),
  buyerId: z.string().uuid().optional(),
  sellerId: z.string().uuid().optional(),
  paymentStatus: paymentStatusEnum.optional(),
})

export type Order = z.infer<typeof orderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderListParams = z.infer<typeof orderListParamsSchema>
