import { z } from 'zod'

import { paginationParamsSchema } from '../pagination'

export const userRolesSchema = z.enum(['BUYER', 'SELLER', 'ADMIN'])
export type UserRole = z.infer<typeof userRolesSchema>

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  role: userRolesSchema,
  isEmailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
})

export const userListParamsSchema = paginationParamsSchema.extend({
  role: userRolesSchema.optional(),
  search: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserListParams = z.infer<typeof userListParamsSchema>
