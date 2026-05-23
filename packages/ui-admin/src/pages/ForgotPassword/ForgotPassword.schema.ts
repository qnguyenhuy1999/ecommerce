import { z } from '@ecom/core-ui'

export const forgotPasswordSchema = z.object({
  email: z.email('Enter valid email address'),
})
