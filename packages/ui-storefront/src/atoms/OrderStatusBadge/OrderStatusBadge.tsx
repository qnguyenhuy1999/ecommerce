import {
  CheckCircle2,
  Clock,
  RefreshCcw,
  Truck,
  XCircle,
} from 'lucide-react'

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
    variant: 'warning' | 'info' | 'success' | 'destructive' | 'secondary' | 'default' | 'outline' | 'primary'
    className?: string
    Icon: React.ComponentType<{ className?: string }>
  }
> = {
  PENDING_PAYMENT: {
    label: 'Pending',
    variant: 'warning',
    Icon: Clock,
  },
  PAID: {
    label: 'Paid',
    variant: 'info',
    Icon: CheckCircle2,
  },
  PROCESSING: {
    label: 'Processing',
    variant: 'info',
    Icon: RefreshCcw,
  },
  SHIPPED: {
    label: 'Shipped',
    variant: 'primary',
    Icon: Truck,
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success',
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'destructive',
    Icon: XCircle,
  },
  REFUNDED: {
    label: 'Refunded',
    variant: 'secondary',
    Icon: RefreshCcw,
  },
  PENDING_REFUND: {
    label: 'Pending Refund',
    variant: 'warning',
    Icon: Clock,
  },
}

export interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
  size?: 'sm' | 'md'
}

function OrderStatusBadge({ status, className, size = 'md' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const { Icon } = config
  
  return (
    <Badge
      variant={config.variant}
      size={size === 'sm' ? 'sm' : 'md'}
      icon={<Icon className={cn('shrink-0', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} aria-hidden="true" />}
      className={cn(
        'font-medium whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  )
}

export { OrderStatusBadge }
