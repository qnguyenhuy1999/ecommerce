import { z } from '@ecom/core-ui/vendors/zod'

export const warehouseDetailSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  address: z.string().optional(),
  isDefault: z.boolean(),
})

export type WarehouseDetailSchemaData = z.infer<typeof warehouseDetailSchema>
