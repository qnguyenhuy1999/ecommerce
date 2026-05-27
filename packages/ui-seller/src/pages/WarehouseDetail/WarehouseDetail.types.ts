export interface WarehouseFormValues {
  name: string
  code: string
  address?: string | undefined
  isDefault: boolean
}

export interface WarehouseDetailProps {
  initialValues?: Partial<WarehouseFormValues>
  onSubmit?: (values: WarehouseFormValues) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}
