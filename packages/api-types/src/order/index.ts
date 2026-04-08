import { z } from 'zod';
import { PaginationParamsSchema } from '../common';

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1).max(100),
  phone: z.string().min(6).max(20),
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(2).max(2).default('SG'),
});

export const CheckoutRequestSchema = z.object({
  shippingAddress: ShippingAddressSchema,
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const OrderResponseSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum([
    'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED',
    'COMPLETED', 'CANCELLED', 'REFUNDED', 'PENDING_REFUND',
  ]),
  subtotal: z.number(),
  shippingFee: z.number(),
  totalAmount: z.number(),
  shippingAddress: ShippingAddressSchema,
  subOrders: z.array(
    z.object({
      id: z.string(),
      sellerId: z.string(),
      storeName: z.string(),
      subtotal: z.number(),
      status: z.enum([
        'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED',
        'COMPLETED', 'CANCELLED', 'REFUNDED', 'PENDING_REFUND',
      ]),
      shippingTracking: z.record(z.string()).nullable(),
      items: z.array(
        z.object({
          id: z.string(),
          productName: z.string(),
          variantSku: z.string(),
          attributes: z.record(z.string()),
          quantity: z.number(),
          unitPrice: z.number(),
          priceSnapshot: z.record(z.unknown()),
        }),
      ),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

export const OrderListRequestSchema = PaginationParamsSchema.extend({
  status: z.enum([
    'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED',
    'COMPLETED', 'CANCELLED', 'REFUNDED', 'PENDING_REFUND',
  ]).optional(),
});

export type OrderListRequest = z.infer<typeof OrderListRequestSchema>;

export const UpdateOrderStatusRequestSchema = z.object({
  status: z.enum([
    'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED',
  ]),
  shippingTracking: z
    .object({
      carrier: z.string(),
      trackingNumber: z.string(),
    })
    .optional(),
});

export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;

export const RefundRequestSchema = z.object({
  reason: z.string().min(10).max(500).optional(),
});

export type RefundRequest = z.infer<typeof RefundRequestSchema>;
