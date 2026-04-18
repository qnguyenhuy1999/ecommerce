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

const statusMap: Record<
  StatusValue,
  { variant: UiBadgeProps['variant']; defaultLabel: string; dotColor: string }
> = {
  pending: { variant: 'warning', defaultLabel: 'Pending', dotColor: 'var(--warning-500)' },
  processing: { variant: 'info', defaultLabel: 'Processing', dotColor: 'var(--info-500)' },
  shipped: { variant: 'info', defaultLabel: 'Shipped', dotColor: 'var(--info-500)' },
  delivered: { variant: 'success', defaultLabel: 'Delivered', dotColor: 'var(--success-500)' },
  cancelled: { variant: 'destructive', defaultLabel: 'Cancelled', dotColor: 'var(--error-500)' },
  refunded: { variant: 'secondary', defaultLabel: 'Refunded', dotColor: 'var(--gray-500)' },
  failed: { variant: 'destructive', defaultLabel: 'Failed', dotColor: 'var(--error-500)' },
}

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const config = statusMap[status] || statusMap.pending

  return (
    <UiBadge
      dot
      dotColor={config.dotColor}
      variant={config.variant}
      className={cn('capitalize whitespace-nowrap', className)}
      {...props}
    >
      {label || config.defaultLabel}
    </UiBadge>
  )
}

export { StatusBadge }
