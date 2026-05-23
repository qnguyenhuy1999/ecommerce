import { z } from '@ecom/core-ui'

export const addRuleSchema = z
  .object({
    scope: z.enum(['global', 'category', 'vendor']),
    name: z.string(),
    commissionPct: z.string().min(1, 'Required'),
    paymentFeePct: z.string().min(1, 'Required'),
    effectiveFrom: z.string().min(1, 'Required'),
  })
  .superRefine((data, ctx) => {
    if (data.scope !== 'global' && !data.name.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Required',
        path: ['name'],
      })
    }
  })

export type AddRuleSchemaValues = z.infer<typeof addRuleSchema>
