import { Badge as UiBadge, type BadgeProps as UiBadgeProps } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { type StatusValue, STATUS_MAP } from './StatusBadge.fixtures'

export type { StatusValue }

export interface StatusBadgeProps extends Omit<UiBadgeProps, 'variant'> {
  status: StatusValue
  label?: string
}

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.pending

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
