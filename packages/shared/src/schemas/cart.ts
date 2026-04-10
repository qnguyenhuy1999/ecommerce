import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  productImage: z.string().url().nullable(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
  sellerId: z.string().uuid(),
})

export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(cartItemSchema),
  totalItems: z.number().int().min(0),
  subtotal: z.number().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(999).default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(999),
})

export type Cart = z.infer<typeof cartSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
