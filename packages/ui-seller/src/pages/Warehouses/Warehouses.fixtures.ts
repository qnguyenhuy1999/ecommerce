import type { WarehousesProps } from './Warehouses.types'

export const defaultProps = {
  initialSearch: '',
  onCreateClick: undefined,
} satisfies WarehousesProps

export const mockWarehouses = [
  {
    id: '1',
    name: 'Main Warehouse',
    code: 'WH-MAIN',
    address: '123 Main St',
    isActive: true,
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    _count: { stocks: 42 },
  },
  {
    id: '2',
    name: 'Secondary',
    code: 'WH-SEC',
    address: null,
    isActive: false,
    isDefault: false,
    createdAt: '2025-03-01T00:00:00Z',
    _count: { stocks: 10 },
  },
]
