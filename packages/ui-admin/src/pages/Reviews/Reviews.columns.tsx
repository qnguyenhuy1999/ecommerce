'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { StatusBadge, type DataTableColumn } from '@ecom/core-ui/organisms/DataTable'
import type { ReviewRecord, ReviewsProps } from './Reviews.types'

interface BuildReviewColumnsOptions {
  approveLabel: string
  hideLabel: string
  rejectLabel: string
  onApprove?: ReviewsProps['onApprove']
  onHide?: ReviewsProps['onHide']
  onReject?: ReviewsProps['onReject']
}

export function buildReviewColumns({
  approveLabel,
  hideLabel,
  rejectLabel,
  onApprove,
  onHide,
  onReject,
}: BuildReviewColumnsOptions): DataTableColumn<ReviewRecord>[] {
  return [
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.original.rating
        return (
          <span className="font-medium">
            {'★'.repeat(rating)}
            {'☆'.repeat(5 - rating)}
          </span>
        )
      },
    },
    {
      accessorKey: 'commentPreview',
      header: 'Comment',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground line-clamp-2 max-w-xs">
          {row.original.commentPreview || '—'}
        </Typography>
      ),
    },
    {
      accessorKey: 'reportCount',
      header: () => <div className="text-right">Reports</div>,
      cell: ({ row }) => <div className="text-right">{row.original.reportCount}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex gap-2">
            {item.status === 'PENDING' && (
              <Button type="button" size="sm" variant="default" onClick={() => onApprove?.(item)}>
                {approveLabel}
              </Button>
            )}
            {(item.status === 'PENDING' || item.status === 'APPROVED') && (
              <Button type="button" size="sm" variant="outline" onClick={() => onHide?.(item)}>
                {hideLabel}
              </Button>
            )}
            {item.status === 'PENDING' && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(item)}
              >
                {rejectLabel}
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
