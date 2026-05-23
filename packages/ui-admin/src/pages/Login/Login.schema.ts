import { z } from '@ecom/core-ui'

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  otp: z.string().min(1, 'OTP is required'),
  trustDevice: z.boolean(),
})
