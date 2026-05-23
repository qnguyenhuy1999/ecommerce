import { Button, Typography, type DataTableColumn } from '@ecom/core-ui'
import { ArrowRight, Circle } from 'lucide-react'
import { DisputeStatusBadge } from './Disputes.client'
import { getDisputePriorityDotClassName } from './Disputes.constants'
import type { DisputeRecord } from './Disputes.types'

export function buildDisputeColumns({
  openLabel,
  onOpen,
}: {
  openLabel: string
  onOpen: (item: DisputeRecord) => void
}): DataTableColumn<DisputeRecord>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Dispute',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Circle className={`size-3 ${getDisputePriorityDotClassName(row.original.priority)}`} />
          <Typography as="span" variant="body-sm" className="font-semibold tracking-wide">
            {row.original.id}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: 'orderId',
      header: 'Order',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.orderId}
        </Typography>
      ),
    },
    {
      id: 'participants',
      header: 'Buyer ↔ Seller',
      cell: ({ row }) => `${row.original.buyerName} ↔ ${row.original.sellerName}`,
    },
    {
      accessorKey: 'amountLabel',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-warning block text-right font-semibold">
          {row.original.amountLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.reason}
        </Typography>
      ),
    },
    {
      accessorKey: 'openedAtLabel',
      header: 'Opened',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.openedAtLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <DisputeStatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void onOpen(row.original)
            }}
          >
            {openLabel}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      ),
    },
  ]
}
