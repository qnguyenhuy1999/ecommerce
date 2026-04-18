import { cn } from '@ecom/ui'

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
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })

  const hasSale = originalPrice !== undefined && originalPrice > price

  const textSizes = {
    sm: { price: 'text-[var(--text-sm)]', original: 'text-[var(--text-micro)]' },
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
        {formatter.format(price)}
      </span>

      {hasSale && (
        <>
          <span
            className={cn(
              'text-muted-foreground line-through decoration-muted-foreground/50 font-medium tabular-nums',
              textSizes.original,
            )}
          >
            {formatter.format(originalPrice)}
          </span>
          {/* Discount badge — token-based radius + text */}
          {size !== 'sm' && (
            <span
              className={cn(
                'font-bold text-[var(--text-micro)] uppercase tracking-wider',
                'bg-brand-muted text-brand',
                'px-1.5 py-0.5 rounded-[var(--radius-xs)]',
              )}
            >
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
            </span>
          )}
        </>
      )}
    </div>
  )
}

export { PriceDisplay }
