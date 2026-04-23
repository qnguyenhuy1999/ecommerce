import { formatCurrency } from '@ecom/shared/utils/formatters'
import { cn } from '@ecom/ui'
import { ProductBadge } from '../../atoms/Badge/Badge'

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  originalPrice?: number
  currency?: string
  size?: 'sm' | 'default' | 'lg'
}

function PriceDisplay({
  price,
  originalPrice,
  currency = 'USD',
  size = 'default',
  className,
  ...props
}: PriceDisplayProps) {
  const hasSale = originalPrice !== undefined && originalPrice > price

  const textSizes = {
    sm: { price: 'text-[var(--text-sm)]', original: 'text-[length:var(--text-micro)]' },
    default: { price: 'text-[var(--text-base)]', original: 'text-[var(--text-sm)]' },
    lg: { price: 'text-[var(--text-xl)]', original: 'text-[var(--text-base)]' },
  }[size]

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)} {...props}>
      <span
        className={cn(
          'font-bold tracking-tight text-foreground',
          hasSale && 'text-brand',
          textSizes.price,
        )}
      >
        {formatCurrency(price, currency)}
      </span>

      {hasSale && (
        <>
          <span
            className={cn(
              'text-muted-foreground line-through decoration-muted-foreground/50 font-medium tabular-nums',
              textSizes.original,
            )}
          >
            {formatCurrency(originalPrice, currency)}
          </span>
          {/* Discount badge */}
          <ProductBadge variant="discount">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
          </ProductBadge>
        </>
      )}
    </div>
  )
}

export { PriceDisplay }
