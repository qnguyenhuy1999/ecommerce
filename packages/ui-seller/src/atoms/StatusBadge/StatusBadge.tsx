import { Badge } from '@ecom/core-ui/atoms/Badge'

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  PUBLISHED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-warning/10 text-warning',
  PENDING: 'bg-warning/10 text-warning',
  CONFIRMED: 'bg-primary/10 text-primary',
  PACKING: 'bg-purple-500/10 text-purple-600',
  SHIPPED: 'bg-indigo-500/10 text-indigo-600',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-destructive/10 text-destructive',
  ACTIVE: 'bg-success/10 text-success',
  INACTIVE: 'bg-muted text-muted-foreground',
  SUSPENDED: 'bg-destructive/10 text-destructive',
  EXPIRED: 'bg-muted text-muted-foreground',
  SCHEDULED: 'bg-primary/10 text-primary',
  QUEUED: 'bg-warning/10 text-warning',
  PROCESSING: 'bg-primary/10 text-primary',
  COMPLETED: 'bg-success/10 text-success',
  FAILED: 'bg-destructive/10 text-destructive',
  PARTIALLY_COMPLETED: 'bg-orange-500/10 text-orange-600',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  HIDDEN: 'bg-muted text-muted-foreground',
  REQUESTED: 'bg-warning/10 text-warning',
  REVIEWING: 'bg-primary/10 text-primary',
  RETURN_SHIPPING: 'bg-indigo-500/10 text-indigo-600',
  RECEIVED: 'bg-purple-500/10 text-purple-600',
  REFUNDED: 'bg-success/10 text-success',
  CLOSED: 'bg-muted text-muted-foreground',
  PENDING_REVIEW: 'bg-warning/10 text-warning',
  REVISION_REQUESTED: 'bg-orange-500/10 text-orange-600',
  IN_TRANSIT: 'bg-indigo-500/10 text-indigo-600',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground'
  return (
    <Badge variant="secondary" className={`rounded-full px-3 ${className}`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  )
}
