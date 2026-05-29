import { formatDateIntl } from '@ecom/shared'
import type { DataTableColumn } from '@ecom/core-ui'
import { StatusBadge } from '../../atoms/StatusBadge'
import type { ApprovalRow, ApprovalsProps } from './Approvals.types'

export function makeApprovalsColumns(
  onResubmit?: ApprovalsProps['onResubmit'],
): DataTableColumn<ApprovalRow>[] {
  return [
    {
      accessorKey: 'productId',
      header: 'Product ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.productId.slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }) => `v${row.original.version}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'rejectionReason',
      header: 'Rejection Reason',
      cell: ({ row }) => row.original.rejectionReason ?? '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        if (
          (row.original.status === 'REJECTED' || row.original.status === 'REVISION_REQUESTED') &&
          onResubmit
        ) {
          return (
            <button
              onClick={() => void onResubmit(row.original.id)}
              className="text-xs text-blue-600 hover:underline"
            >
              Resubmit
            </button>
          )
        }
        return null
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => formatDateIntl(row.original.createdAt),
    },
  ]
}
