import { z } from '@ecom/core-ui'

export function createLoginSchema(showOtp = false) {
  return z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    otp: showOtp ? z.string().min(1, 'OTP is required') : z.string(),
    trustDevice: z.boolean(),
  })
}
