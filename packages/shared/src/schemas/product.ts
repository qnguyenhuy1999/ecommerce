import { z } from 'zod'
import { paginationParamsSchema } from '../pagination'

export const productStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK'])
export type ProductStatus = z.infer<typeof productStatusSchema>

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
})

export const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
})

export const productSchema = z.object({
  id: z.string().uuid(),
  sellerId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable(),
  costPrice: z.number().positive().nullable(),
  sku: z.string(),
  stock: z.number().int().min(0),
  status: productStatusSchema,
  categoryId: z.string().uuid().nullable(),
  tags: z.array(z.string()),
  images: z.array(productImageSchema),
  weight: z.number().positive().nullable(),
  dimensions: dimensionsSchema.nullable(),
  rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  costPrice: z.number().positive().nullable().optional(),
  sku: z.string().min(1).max(100),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).default([]),
  images: z.array(productImageSchema).default([]),
  weight: z.number().positive().nullable().optional(),
  dimensions: dimensionsSchema.nullable().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export const productListParamsSchema = paginationParamsSchema.extend({
  sellerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  status: productStatusSchema.optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
})

export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductListParams = z.infer<typeof productListParamsSchema>
