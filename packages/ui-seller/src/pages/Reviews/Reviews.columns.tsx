import type { DataTableColumn } from '@ecom/core-ui'
import { Button } from '@ecom/core-ui'
import { Star } from 'lucide-react'
import { REVIEWS_STATUS_BADGE_STYLES } from './Reviews.constants'
import type { ReviewRow, ReviewStatus } from './Reviews.types'

function StarRating({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {([1, 2, 3, 4, 5] as const).map((star) => (
        <Star
          key={star}
          className={`size-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${REVIEWS_STATUS_BADGE_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

export function buildReviewsColumns(onReply: (id: string) => void): DataTableColumn<ReviewRow>[] {
  return [
    {
      id: 'rating',
      header: 'Rating',
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      id: 'content',
      header: 'Review',
      cell: ({ row }) => {
        const { title, comment } = row.original
        return (
          <div className="max-w-xs min-w-0">
            {title ? (
              <div className="text-foreground truncate text-sm font-medium">{title}</div>
            ) : null}
            {comment ? (
              <div className="text-muted-foreground truncate text-sm">{comment}</div>
            ) : null}
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <ReviewStatusBadge status={row.original.status} />,
    },
    {
      id: 'reply',
      header: 'Reply',
      cell: ({ row }) => {
        if (row.original.hasReply) {
          return <span className="text-muted-foreground text-sm">Replied</span>
        }
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl text-xs"
            onClick={() => onReply(row.original.id)}
          >
            Reply
          </Button>
        )
      },
    },
    {
      id: 'createdAtLabel',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.createdAtLabel}</span>
      ),
    },
  ]
}
