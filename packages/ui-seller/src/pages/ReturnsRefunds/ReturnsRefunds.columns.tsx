import type { DataTableColumn } from '@ecom/core-ui/organisms/DataTable'
import {
  returnStatusClassNames,
  returnStatusLabels,
  formatReturnAmount,
} from './ReturnsRefunds.constants'
import type { ReturnRow, ReturnsRefundsStatus } from './ReturnsRefunds.types'

function ReturnStatusBadge({ status }: { status: ReturnsRefundsStatus }) {
  const styles = returnStatusClassNames[status]

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${styles.text}`}>
      <span className={`size-2 rounded-full ${styles.dot}`} />
      {returnStatusLabels[status]}
    </span>
  )
}

export function createReturnsColumns(
  onSelect: (row: ReturnRow) => void,
): DataTableColumn<ReturnRow>[] {
  return [
    {
      id: 'caseId',
      header: 'Case',
      cell: ({ row }) => (
        <button
          type="button"
          className="text-foreground hover:text-primary font-mono text-sm font-medium hover:underline"
          onClick={() => onSelect(row.original)}
        >
          {row.original.caseId}
        </button>
      ),
    },
    {
      accessorKey: 'orderNumber',
      header: 'Order',
      cell: ({ row }) => (
        <span className="text-foreground font-semibold">{row.original.orderNumber}</span>
      ),
    },
    {
      accessorKey: 'buyerName',
      header: 'Buyer',
      cell: ({ row }) => <span className="text-primary font-medium">{row.original.buyerName}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <button
          type="button"
          className="text-primary text-left text-sm hover:underline"
          onClick={() => onSelect(row.original)}
        >
          {row.original.reason}
        </button>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-foreground font-semibold">
          {formatReturnAmount(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <ReturnStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'openedAtLabel',
      header: 'Opened',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.openedAtLabel}</span>
      ),
    },
  ]
}
