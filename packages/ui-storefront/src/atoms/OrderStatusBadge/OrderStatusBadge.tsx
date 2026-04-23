import { Badge, cn } from '@ecom/ui'

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PENDING_REFUND'

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    variant: 'warning' | 'info' | 'success' | 'destructive' | 'secondary' | 'default'
  }
> = {
  PENDING_PAYMENT: { label: 'Pending Payment', variant: 'warning' },
  PAID: { label: 'Paid', variant: 'info' },
  PROCESSING: { label: 'Processing', variant: 'info' },
  SHIPPED: { label: 'Shipped', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
  REFUNDED: { label: 'Refunded', variant: 'secondary' },
  PENDING_REFUND: { label: 'Pending Refund', variant: 'warning' },
}

export interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
  size?: 'sm' | 'md'
}

function OrderStatusBadge({ status, className, size = 'md' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      variant={config.variant}
      size={size === 'sm' ? 'sm' : undefined}
      className={cn('font-medium whitespace-nowrap', className)}
    >
      {config.label}
    </Badge>
  )
}

export { OrderStatusBadge }
