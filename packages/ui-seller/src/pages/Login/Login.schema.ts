import { z } from '@ecom/core-ui'

export const loginSchema = z.object({
  email: z.email('Enter valid email address'),
  password: z.string().min(1, 'Password is required'),
})
