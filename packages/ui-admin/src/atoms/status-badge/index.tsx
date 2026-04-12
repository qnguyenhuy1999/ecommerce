import { Badge as UiBadge, type BadgeProps as UiBadgeProps } from '@ecom/ui'
import { cn } from '@ecom/ui'

export type StatusValue =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export interface StatusBadgeProps extends Omit<UiBadgeProps, 'variant'> {
  status: StatusValue
  label?: string
}

const statusMap: Record<StatusValue, { variant: UiBadgeProps['variant']; defaultLabel: string }> = {
  pending: { variant: 'warning', defaultLabel: 'Pending' },
  processing: { variant: 'info', defaultLabel: 'Processing' },
  shipped: { variant: 'info', defaultLabel: 'Shipped' },
  delivered: { variant: 'success', defaultLabel: 'Delivered' },
  cancelled: { variant: 'destructive', defaultLabel: 'Cancelled' },
  refunded: { variant: 'secondary', defaultLabel: 'Refunded' },
  failed: { variant: 'destructive', defaultLabel: 'Failed' },
}

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const config = statusMap[status] || statusMap.pending

  return (
    <UiBadge
      variant={config.variant}
      className={cn('capitalize whitespace-nowrap', className)}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {label || config.defaultLabel}
    </UiBadge>
  )
}

export { StatusBadge }
