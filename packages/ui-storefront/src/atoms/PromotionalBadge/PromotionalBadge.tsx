import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Zap } from 'lucide-react'

interface PromotionalBadgeProps {
  label: string
  kind?: 'discount' | 'flash' | 'mall' | 'shipping'
}

const badgeStyles = {
  discount: 'bg-destructive text-destructive-foreground',
  flash: 'bg-destructive text-destructive-foreground',
  mall: 'bg-info text-info-foreground',
  shipping: 'bg-success/10 text-success',
} as const

export function PromotionalBadge({ label, kind = 'discount' }: PromotionalBadgeProps) {
  return (
    <Badge size="sm" className={badgeStyles[kind]}>
      {kind === 'flash' && <Zap data-icon="inline-start" />}
      {label}
    </Badge>
  )
}

export type { PromotionalBadgeProps }
