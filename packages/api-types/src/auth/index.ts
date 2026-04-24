import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum(['USER', 'SELLER', 'ADMIN']),
    status: z.enum(['UNVERIFIED', 'ACTIVE', 'SUSPENDED']),
  }),
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const VerifyEmailRequestSchema = z.object({
  token: z.string().min(1),
})

export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>
