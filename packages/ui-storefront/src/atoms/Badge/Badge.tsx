import { Badge as CoreBadge, cn } from '@ecom/ui'
import type { BadgeProps as CoreBadgeProps } from '@ecom/ui'

type CoreVariant = CoreBadgeProps['variant']
type EcomVariant = 'sale' | 'discount' | 'new' | 'limited' | 'out-of-stock'
type BadgeVariant = CoreVariant | EcomVariant

interface StorefrontBadgeProps extends Omit<CoreBadgeProps, 'variant'> {
  variant?: BadgeVariant
}

function Badge({ variant, className, children, ...props }: StorefrontBadgeProps) {
  // Map storefront/business variants to core variant + optional extra classes
  let coreVariant: CoreVariant | undefined = undefined
  let extraClass = ''

  switch (variant as BadgeVariant) {
    case 'sale':
    case 'discount':
      coreVariant = 'soft' as CoreVariant
      extraClass =
        'border-transparent bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px'
      break
    case 'new':
      coreVariant = 'primary' as CoreVariant
      extraClass =
        'border-transparent bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-sm)]'
      break
    case 'limited':
      coreVariant = 'warning' as CoreVariant
      extraClass = 'border-transparent bg-[var(--surface-elevated)] text-foreground'
      break
    case 'out-of-stock':
      coreVariant = 'default' as CoreVariant
      extraClass =
        'border-transparent bg-[var(--surface-muted)] text-[var(--text-tertiary)] backdrop-blur-sm hover:bg-[var(--surface-subtle)]'
      break
    default:
      coreVariant = variant as CoreVariant
  }

  return (
    <CoreBadge
      variant={coreVariant}
      className={cn(extraClass, className)}
      {...(props as CoreBadgeProps)}
    >
      {children}
    </CoreBadge>
  )
}

export { Badge }
export type { StorefrontBadgeProps }
