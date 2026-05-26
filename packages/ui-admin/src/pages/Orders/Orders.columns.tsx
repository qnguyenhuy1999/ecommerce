'use client'

import { StatusBadge, Typography, type DataTableColumn } from '@ecom/core-ui'
import type { OrderRecord, OrdersProps } from './Orders.types'

interface BuildOrderColumnsOptions {
  viewLabel: string
  onView?: OrdersProps['onView']
}

export function buildOrderColumns({
  viewLabel,
  onView,
}: BuildOrderColumnsOptions): DataTableColumn<OrderRecord>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="font-mono font-medium">
          {row.original.id.slice(0, 8)}…
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'totalAmountLabel',
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <Typography variant="body-sm" className="block text-right font-semibold">
          {row.original.totalAmountLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'sellerCount',
      header: () => <div className="text-right">Sellers</div>,
      cell: ({ row }) => <div className="text-right">{row.original.sellerCount}</div>,
    },
    {
      accessorKey: 'itemCount',
      header: () => <div className="text-right">Items</div>,
      cell: ({ row }) => <div className="text-right">{row.original.itemCount}</div>,
    },
    {
      accessorKey: 'createdAtLabel',
      header: 'Created',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.createdAtLabel}
        </Typography>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        onView ? (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs underline"
              onClick={() => onView(row.original)}
            >
              {viewLabel}
            </button>
          </div>
        ) : null,
    },
  ]
}
