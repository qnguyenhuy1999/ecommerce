import type { WarehouseDetailSchemaData } from './WarehouseDetail.schema'

export type WarehouseFormValues = WarehouseDetailSchemaData

export interface WarehouseDetailProps {
  initialValues?: Partial<WarehouseFormValues>
  onSubmit?: (values: WarehouseFormValues) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}
