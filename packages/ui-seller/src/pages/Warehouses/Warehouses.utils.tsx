import { formatDateIntl } from '@ecom/shared'
import type { DataTableColumn } from '@ecom/core-ui'
import { StatusBadge } from '../../atoms/StatusBadge'
import type { WarehouseRow } from './Warehouses.types'

export const warehousesColumns: DataTableColumn<WarehouseRow>[] = [
  {
    id: 'name',
    header: 'Warehouse',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-muted-foreground text-xs">{row.original.code}</div>
      </div>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => row.original.address ?? '—',
  },
  {
    id: 'stocks',
    header: 'SKUs',
    cell: ({ row }) => String(row.original._count.stocks),
  },
  {
    accessorKey: 'isDefault',
    header: 'Default',
    cell: ({ row }) =>
      row.original.isDefault ? (
        <span className="text-sm font-medium text-green-600">Yes</span>
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'ACTIVE' : 'INACTIVE'} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDateIntl(row.original.createdAt),
  },
]
