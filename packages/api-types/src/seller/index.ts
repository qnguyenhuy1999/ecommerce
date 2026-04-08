import { z } from 'zod';
import { PaginationParamsSchema } from '../common';

export const KycSubmitRequestSchema = z.object({
  storeName: z.string().min(3).max(100),
  storeDescription: z.string().max(500).optional(),
  businessRegistrationNumber: z.string().max(50).optional(),
  bankAccountNumber: z.string().max(30).optional(),
  bankCode: z.string().max(20).optional(),
  kycDocuments: z
    .object({
      businessReg: z.string().url().optional(),
      identityDoc: z.string().url().optional(),
      bankAccount: z.string().url().optional(),
    })
    .optional(),
});

export type KycSubmitRequest = z.infer<typeof KycSubmitRequestSchema>;

export const SellerResponseSchema = z.object({
  id: z.string(),
  storeName: z.string(),
  storeDescription: z.string().nullable(),
  kycStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  commissionRate: z.number(),
  rating: z.number(),
  totalRatings: z.number(),
  createdAt: z.string(),
});

export type SellerResponse = z.infer<typeof SellerResponseSchema>;

export const SellerListRequestSchema = PaginationParamsSchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  search: z.string().optional(),
});

export type SellerListRequest = z.infer<typeof SellerListRequestSchema>;

export const UpdateSellerRequestSchema = z.object({
  storeName: z.string().min(3).max(100).optional(),
  storeDescription: z.string().max(500).optional(),
  bankAccountNumber: z.string().max(30).optional(),
  bankCode: z.string().max(20).optional(),
});

export type UpdateSellerRequest = z.infer<typeof UpdateSellerRequestSchema>;
