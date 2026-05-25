import type { WarehouseDetailProps } from './WarehouseDetail.types'

export const defaultProps = {
  initialValues: {},
  onSubmit: async () => {},
  onCancel: undefined,
  isLoading: false,
} satisfies WarehouseDetailProps
