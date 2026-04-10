import { z } from 'zod'
import { paginationParamsSchema } from '../pagination'

export const sellerStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'])
export type SellerStatus = z.infer<typeof sellerStatusSchema>

export const sellerSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  storeName: z.string().min(2).max(100),
  storeDescription: z.string().max(500).optional(),
  status: sellerStatusSchema,
  rejectionReason: z.string().nullable(),
  commissionRate: z.number().min(0).max(100),
  totalSales: z.number().default(0),
  totalRevenue: z.number().default(0),
  rating: z.number().min(0).max(5).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const sellerAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().default('VN'),
})

export const createSellerSchema = z.object({
  storeName: z.string().min(2).max(100),
  storeDescription: z.string().max(500).optional(),
  phone: z.string().optional(),
  address: sellerAddressSchema,
})

export const updateSellerSchema = z.object({
  storeName: z.string().min(2).max(100).optional(),
  storeDescription: z.string().max(500).optional(),
  phone: z.string().optional(),
})

export const approveSellerSchema = z.object({
  status: sellerStatusSchema,
  commissionRate: z.number().min(0).max(100).optional(),
  rejectionReason: z.string().optional(),
})

export const sellerListParamsSchema = paginationParamsSchema.extend({
  status: sellerStatusSchema.optional(),
  search: z.string().optional(),
})

export type Seller = z.infer<typeof sellerSchema>
export type CreateSellerInput = z.infer<typeof createSellerSchema>
export type UpdateSellerInput = z.infer<typeof updateSellerSchema>
export type ApproveSellerInput = z.infer<typeof approveSellerSchema>
export type SellerListParams = z.infer<typeof sellerListParamsSchema>
