import { formatDateTime } from '@ecom/shared'
import type { DataTableColumn } from '@ecom/core-ui'
import { StatusBadge } from '../../atoms/StatusBadge'
import type { BulkJobRow } from './Bulk.types'

export const bulkColumns: DataTableColumn<BulkJobRow>[] = [
  {
    accessorKey: 'fileName',
    header: 'File Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => row.original.type.replace(/_/g, ' '),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'processedRows',
    header: 'Progress',
    cell: ({ row }) => {
      if (row.original.processedRows === null) return '—'
      return `${row.original.successRows ?? 0} / ${row.original.processedRows} (${row.original.errorRows ?? 0} errors)`
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
]
