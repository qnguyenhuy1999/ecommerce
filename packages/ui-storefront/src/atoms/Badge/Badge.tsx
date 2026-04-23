import type { BadgeProps as CoreBadgeProps } from '@ecom/ui'
import { Badge as CoreBadge, cn } from '@ecom/ui'

type CoreVariant = CoreBadgeProps['variant']
type EcomVariant = 'sale' | 'discount' | 'new' | 'limited' | 'out-of-stock'
type BadgeVariant = CoreVariant | EcomVariant

interface ProductBadgeProps extends Omit<CoreBadgeProps, 'variant'> {
  variant?: BadgeVariant
}

function ProductBadge({ variant, className, children, ...props }: ProductBadgeProps) {
  // Storefront exposes business-facing variants; translate to core variants so styling stays centralized.
  let coreVariant: CoreVariant | undefined = undefined
  let extraClass = ''
  let defaultText = ''

  switch (variant as BadgeVariant) {
    case 'sale':
      coreVariant = 'soft' as CoreVariant
      extraClass =
        'border-transparent bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-[var(--intent-danger-fg)] shadow-sm hover:shadow-md hover:-translate-y-[1px] font-bold tracking-wide uppercase text-[0.65rem]'
      defaultText = 'Sale'
      break
    case 'discount':
      coreVariant = 'soft' as CoreVariant
      extraClass =
        'border-transparent bg-gradient-to-r from-[var(--warning-400)] to-[var(--warning-500)] text-white shadow-sm hover:shadow-md hover:-translate-y-[1px] font-bold tracking-wide uppercase text-[0.65rem]'
      defaultText = 'Discount'
      break
    case 'new':
      coreVariant = 'primary' as CoreVariant
      extraClass =
        'border-transparent bg-gradient-to-r from-[var(--info-400)] to-[var(--info-500)] text-white shadow-sm hover:-translate-y-[1px] font-bold tracking-wide uppercase text-[0.65rem]'
      defaultText = 'New'
      break
    case 'limited':
      coreVariant = 'warning' as CoreVariant
      extraClass = 'border-transparent bg-gradient-to-r from-[var(--warning-400)] to-[var(--warning-500)] text-white shadow-sm hover:-translate-y-[1px] font-bold tracking-wide uppercase text-[0.65rem]'
      defaultText = 'Limited'
      break
    case 'out-of-stock':
      coreVariant = 'default' as CoreVariant
      extraClass =
        'border-transparent bg-[var(--surface-muted)] text-[var(--text-tertiary)] backdrop-blur-sm hover:bg-[var(--surface-subtle)] font-bold tracking-wide uppercase text-[0.65rem] shadow-none'
      defaultText = 'Out of Stock'
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
      {children ?? defaultText}
    </CoreBadge>
  )
}

export { ProductBadge }
export type { ProductBadgeProps }
