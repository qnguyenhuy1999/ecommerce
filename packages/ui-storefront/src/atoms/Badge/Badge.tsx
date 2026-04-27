import type { BadgeProps as CoreBadgeProps } from '@ecom/ui'
import { Badge as CoreBadge, cn } from '@ecom/ui'

type CoreVariant = CoreBadgeProps['variant']
type EcomVariant = 'sale' | 'discount' | 'new' | 'limited' | 'out-of-stock'
type BadgeVariant = CoreVariant | EcomVariant

interface ProductBadgeProps extends Omit<CoreBadgeProps, 'variant'> {
  variant?: BadgeVariant
}

const ECOM_VARIANT_CLASSES: Record<
  EcomVariant,
  { core: CoreVariant; classes: string; label: string }
> = {
  sale: {
    core: 'soft',
    classes: 'bg-[var(--brand-500)] text-white border-transparent',
    label: 'Sale',
  },
  discount: {
    core: 'soft',
    classes: 'bg-[var(--warning-500)] text-white border-transparent',
    label: 'Discount',
  },
  new: {
    core: 'primary',
    classes: 'bg-[var(--info-500)] text-white border-transparent',
    label: 'New',
  },
  limited: {
    core: 'warning',
    classes: 'bg-[var(--warning-500)] text-white border-transparent',
    label: 'Limited',
  },
  'out-of-stock': {
    core: 'default',
    classes: 'bg-[var(--surface-base)] text-[var(--text-tertiary)] border-[var(--border-subtle)]',
    label: 'Out of stock',
  },
}

const ECOM_KEYS = Object.keys(ECOM_VARIANT_CLASSES) as EcomVariant[]

function ProductBadge({ variant, className, children, ...props }: ProductBadgeProps) {
  // Storefront exposes business-facing variants; translate to core variants so styling stays centralized.
  if (variant && ECOM_KEYS.includes(variant as EcomVariant)) {
    const v = ECOM_VARIANT_CLASSES[variant as EcomVariant]
    return (
      <CoreBadge
        variant={v.core}
        size="sm"
        className={cn('font-semibold uppercase tracking-[0.06em]', v.classes, className)}
        {...(props as CoreBadgeProps)}
      >
        {children ?? v.label}
      </CoreBadge>
    )
  }

  return (
    <CoreBadge
      variant={variant as CoreVariant}
      className={cn(className)}
      {...(props as CoreBadgeProps)}
    >
      {children}
    </CoreBadge>
  )
}

export { ProductBadge }
export type { ProductBadgeProps }
