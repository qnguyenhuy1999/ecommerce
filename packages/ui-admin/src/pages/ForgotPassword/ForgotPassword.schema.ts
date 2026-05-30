import { z } from '@ecom/core-ui/vendors/zod'

export const forgotPasswordSchema = z.object({
  email: z.email('Enter valid email address'),
})
