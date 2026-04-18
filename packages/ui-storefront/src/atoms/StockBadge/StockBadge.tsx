'use client'

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

import { cn } from '@ecom/ui'

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
  },
  'low-stock': {
    label: undefined, // label derived from count
    icon: AlertTriangle,
    variant: 'warning' as const,
  },
  'out-of-stock': {
    label: 'Out of Stock',
    icon: XCircle,
    variant: 'destructive' as const,
  },
}

function StockBadge({ status, count, className, ...props }: StockBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  // For low-stock, derive label from count
  const label = status === 'low-stock' && count !== undefined ? `Only ${count} left` : config.label

  if (!label) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        // Use semantic colors from the Badge system
        status === 'in-stock' && 'text-success',
        status === 'low-stock' && 'text-warning',
        status === 'out-of-stock' && 'text-destructive',
        'text-[var(--text-micro)] font-medium',
        className,
      )}
      {...props}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </div>
  )
}

export { StockBadge }
