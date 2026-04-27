import { z } from 'zod'

import { PaginationParamsSchema } from '../common'

export const CreateProductRequestSchema = z.object({
  sku: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  status: z.enum(['DRAFT', 'ACTIVE']).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string().url()).max(10).optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1).max(100),
        attributes: z.record(z.string()),
        priceOverride: z.number().positive().optional(),
        stock: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
})

export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>

export const UpdateProductRequestSchema = CreateProductRequestSchema.partial()

export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>

export const ProductResponseSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'DELETED']),
  categoryId: z.string().nullable(),
  images: z.array(z.string()),
  rating: z.number(),
  reviewCount: z.number(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        sku: z.string(),
        attributes: z.record(z.string()),
        priceOverride: z.number().nullable(),
        stock: z.number(),
        reservedStock: z.number(),
      }),
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ProductResponse = z.infer<typeof ProductResponseSchema>

export const ProductListRequestSchema = PaginationParamsSchema.extend({
  q: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  sku: z.string().optional(),
  storeName: z.string().optional(),
  sellerId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(['name', 'price', 'createdAt', 'updatedAt', 'rating']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type ProductListRequest = z.infer<typeof ProductListRequestSchema>
