import type { BadgeProps } from '@ecom/ui'

// Exported for consumers and tests
export type StatusValue =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export const STATUS_MAP: Record<
  StatusValue,
  { variant: BadgeProps['variant']; defaultLabel: string; dotColor: string }
> = {
  pending: { variant: 'warning', defaultLabel: 'Pending', dotColor: 'var(--warning-500)' },
  processing: { variant: 'info', defaultLabel: 'Processing', dotColor: 'var(--info-500)' },
  shipped: { variant: 'info', defaultLabel: 'Shipped', dotColor: 'var(--info-500)' },
  delivered: { variant: 'success', defaultLabel: 'Delivered', dotColor: 'var(--success-500)' },
  cancelled: { variant: 'destructive', defaultLabel: 'Cancelled', dotColor: 'var(--error-500)' },
  refunded: { variant: 'secondary', defaultLabel: 'Refunded', dotColor: 'var(--gray-500)' },
  failed: { variant: 'destructive', defaultLabel: 'Failed', dotColor: 'var(--error-500)' },
} as const
