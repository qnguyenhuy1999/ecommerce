import { formatCurrency } from '@ecom/shared/utils/formatters'
import { cn } from '@ecom/ui'
import { ProductBadge } from '../../atoms/Badge/Badge'

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  originalPrice?: number
  currency?: string
  size?: 'sm' | 'default' | 'lg'
}

const variants = {
  sm: { price: 'text-sm', original: 'text-[length:var(--text-micro)]' },
  default: { price: 'text-[length:var(--text-base)]', original: 'text-sm' },
  lg: { price: 'text-xl', original: 'text-[length:var(--text-base)]' },
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

  const textSizes = variants[size] || variants.default

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
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
              'text-[var(--text-disabled)] line-through decoration-muted-foreground/50 font-medium tabular-nums mt-0.5',
              textSizes.original,
            )}
          >
            {formatCurrency(originalPrice, currency)}
          </span>

          <ProductBadge variant="discount">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
          </ProductBadge>
        </>
      )}
    </div>
  )
}

export { PriceDisplay }
