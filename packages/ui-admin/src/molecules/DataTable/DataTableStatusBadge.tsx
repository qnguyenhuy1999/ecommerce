import { AlertTriangle, CheckCircle2, Pencil, XCircle } from 'lucide-react'

import { Badge, cn } from '@ecom/ui'

export interface DataTableStatusBadgeProps {
  status: 'active' | 'low_stock' | 'out_of_stock' | 'draft'
  className?: string
}

const DATA_TABLE_STATUS_CONFIG = {
  active: {
    label: 'Active',
    variant: 'success' as const,
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  low_stock: {
    label: 'Low Stock',
    variant: 'warning' as const,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  out_of_stock: {
    label: 'Out of Stock',
    variant: 'destructive' as const,
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  draft: {
    label: 'Draft',
    variant: 'secondary' as const,
    icon: <Pencil className="h-3.5 w-3.5" />,
  },
} as const

export function DataTableStatusBadge({ status, className }: DataTableStatusBadgeProps) {
  const { label, variant, icon } =
    DATA_TABLE_STATUS_CONFIG[status] ?? DATA_TABLE_STATUS_CONFIG.draft
  return (
    <Badge variant={variant} size="sm" icon={icon} className={cn('shrink-0', className)}>
      {label}
    </Badge>
  )
}
