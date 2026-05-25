export interface WarehouseRow {
  id: string
  name: string
  code: string
  address: string | null
  isActive: boolean
  isDefault: boolean
  createdAt: string
  _count: { stocks: number }
}

export interface WarehousesProps {
  initialSearch?: string
  onCreateClick?: () => void
}
