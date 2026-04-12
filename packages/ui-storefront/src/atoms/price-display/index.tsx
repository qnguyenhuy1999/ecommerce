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
    sm: { price: 'text-sm', original: 'text-xs' },
    default: { price: 'text-base', original: 'text-sm' },
    lg: { price: 'text-xl', original: 'text-base' },
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
              'text-muted-foreground line-through decoration-muted-foreground/50 font-medium translate-y-[1px]',
              textSizes.original,
            )}
          >
            {formatter.format(originalPrice)}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] font-bold text-brand uppercase tracking-wider bg-brand-muted px-1.5 py-0.5 rounded-[4px] ml-1">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
            </span>
          )}
        </>
      )}
    </div>
  )
}

export { PriceDisplay }
