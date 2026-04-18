'use client'

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

import { Badge, cn } from '@ecom/ui'

export interface StockBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  count?: number
  threshold?: number
}

const statusConfig = {
  'in-stock': {
    label: 'In Stock',
    icon: CheckCircle2,
    variant: 'success' as const,
    className: 'bg-success/18 text-success border-success/35 shadow-[var(--shadow-xs)]',
  },
  'low-stock': {
    label: undefined, // label derived from count
    icon: AlertTriangle,
    variant: 'warning' as const,
    className: 'bg-warning/20 text-warning border-warning/40 shadow-[var(--shadow-xs)]',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    icon: XCircle,
    variant: 'destructive' as const,
    className: 'bg-destructive/18 text-destructive border-destructive/35 shadow-[var(--shadow-xs)]',
  },
}

function StockBadge({ status, count, className, ...props }: StockBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  // For low-stock, derive label from count
  const label = status === 'low-stock' && count !== undefined ? `Only ${count} left` : config.label

  if (!label) return null

  return (
    <Badge
      variant={config.variant}
      icon={<Icon className="w-3.5 h-3.5" />}
      className={cn('font-semibold', config.className, className)}
      {...props}
    >
      {label}
    </Badge>
  )
}

export { StockBadge }
