import { z } from 'zod'

import { PaginationParamsSchema } from '../common'

export const KycSubmitRequestSchema = z.object({
  storeName: z.string().min(2).max(120),
  storeDescription: z.string().max(2000).optional(),
  businessRegistrationNumber: z.string().min(1).max(64),
  bankAccountNumber: z.string().min(1).max(64),
  bankCode: z.string().min(1).max(32),
  kycDocuments: z.record(z.unknown()).optional(),
})

export type KycSubmitRequest = z.infer<typeof KycSubmitRequestSchema>

export const SellerResponseSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  storeName: z.string(),
  storeDescription: z.string().nullable(),
  kycStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  commissionRate: z.number(),
  rating: z.number(),
  totalRatings: z.number(),
  businessRegistrationNumber: z.string().nullable().optional(),
  bankAccountNumber: z.string().nullable().optional(),
  bankCode: z.string().nullable().optional(),
  kycDocuments: z.record(z.unknown()).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export type SellerResponse = z.infer<typeof SellerResponseSchema>

export const SellerListRequestSchema = PaginationParamsSchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  search: z.string().optional(),
})

export type SellerListRequest = z.infer<typeof SellerListRequestSchema>

export const UpdateSellerRequestSchema = z.object({
  storeName: z.string().min(2).max(120).optional(),
  storeDescription: z.string().max(2000).optional(),
  businessRegistrationNumber: z.string().max(64).optional(),
  bankAccountNumber: z.string().max(64).optional(),
  bankCode: z.string().max(32).optional(),
  kycDocuments: z.record(z.unknown()).optional(),
})

export type UpdateSellerRequest = z.infer<typeof UpdateSellerRequestSchema>
