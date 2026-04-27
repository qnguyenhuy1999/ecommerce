import { z } from 'zod'

import { PaginationParamsSchema } from '../common'

const ORDER_STATUS = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PENDING_REFUND',
] as const

/** Statuses an admin can transition the top-level order to. */
const ADMIN_ORDER_STATUS_TRANSITION = ['PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const

const KYC_STATUS = ['PENDING', 'APPROVED', 'REJECTED'] as const

// ─── Admin orders ──────────────────────────────────────────────

export const AdminOrderListRequestSchema = PaginationParamsSchema.extend({
  status: z.enum(ORDER_STATUS).optional(),
  sellerId: z.string().min(1).optional(),
  buyerEmail: z.string().min(1).optional(),
  /** ISO-8601 date string (inclusive). */
  placedFrom: z.string().min(1).optional(),
  /** ISO-8601 date string (inclusive). */
  placedTo: z.string().min(1).optional(),
})

export type AdminOrderListRequest = z.infer<typeof AdminOrderListRequestSchema>

const ShippingTrackingSchema = z.object({
  carrier: z.string().min(1),
  trackingNumber: z.string().min(1),
})

const AdminOrderItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  productName: z.string(),
  variantSku: z.string(),
  attributes: z.record(z.unknown()),
  quantity: z.number(),
  unitPrice: z.number(),
})

const AdminSubOrderSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  storeName: z.string(),
  subtotal: z.number(),
  status: z.enum(ORDER_STATUS),
  shippingTracking: ShippingTrackingSchema.nullable(),
  items: z.array(AdminOrderItemSchema),
})

export const AdminOrderSummarySchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  buyerId: z.string(),
  buyerEmail: z.string(),
  status: z.enum(ORDER_STATUS),
  subtotal: z.number(),
  shippingFee: z.number(),
  totalAmount: z.number(),
  itemCount: z.number(),
  sellerCount: z.number(),
  placedAt: z.string(),
})

export type AdminOrderSummary = z.infer<typeof AdminOrderSummarySchema>

export const AdminOrderDetailSchema = AdminOrderSummarySchema.extend({
  shippingAddress: z.record(z.unknown()),
  subOrders: z.array(AdminSubOrderSchema),
  updatedAt: z.string(),
})

export type AdminOrderDetail = z.infer<typeof AdminOrderDetailSchema>

export const AdminUpdateOrderStatusRequestSchema = z.object({
  status: z.enum(ADMIN_ORDER_STATUS_TRANSITION),
})

export type AdminUpdateOrderStatusRequest = z.infer<typeof AdminUpdateOrderStatusRequestSchema>

export const AdminUpdateSubOrderStatusRequestSchema = z.object({
  status: z.enum(ADMIN_ORDER_STATUS_TRANSITION),
  shippingTracking: ShippingTrackingSchema.optional(),
})

export type AdminUpdateSubOrderStatusRequest = z.infer<
  typeof AdminUpdateSubOrderStatusRequestSchema
>

// ─── Admin sellers ─────────────────────────────────────────────

export const AdminSellerListRequestSchema = PaginationParamsSchema.extend({
  kycStatus: z.enum(KYC_STATUS).optional(),
  search: z.string().min(1).optional(),
})

export type AdminSellerListRequest = z.infer<typeof AdminSellerListRequestSchema>

export const AdminSellerSummarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  storeName: z.string(),
  ownerEmail: z.string(),
  kycStatus: z.enum(KYC_STATUS),
  commissionRate: z.number(),
  rating: z.number(),
  totalRatings: z.number(),
  submittedAt: z.string(),
})

export type AdminSellerSummary = z.infer<typeof AdminSellerSummarySchema>

export const AdminSellerDetailSchema = AdminSellerSummarySchema.extend({
  storeDescription: z.string().nullable(),
  businessRegistrationNumber: z.string().nullable(),
  bankAccountNumber: z.string().nullable(),
  bankCode: z.string().nullable(),
  kycDocuments: z.record(z.unknown()).nullable(),
  updatedAt: z.string(),
})

export type AdminSellerDetail = z.infer<typeof AdminSellerDetailSchema>

export const AdminRejectSellerRequestSchema = z.object({
  reason: z.string().min(1).max(1000).optional(),
})

export type AdminRejectSellerRequest = z.infer<typeof AdminRejectSellerRequestSchema>
