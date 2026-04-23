import { formatCurrency } from '@ecom/shared/utils/formatters'

import { cn } from '@ecom/ui'

import { ProductBadge } from '../../atoms/Badge/Badge'

interface ProductCardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  originalPrice?: number
  currency?: string
  currencyCode?: string
  locale?: string
}

export function ProductCardPrice({
  price,
  originalPrice,
  currency = 'USD',
  currencyCode,
  locale,
  className,
  ...props
}: ProductCardPriceProps) {
  const isDiscounted = originalPrice && originalPrice > price
  const discountPercent =
    isDiscounted && originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const effectiveCurrency = currencyCode || (/^[A-Z]{3}$/.test(currency) ? currency : 'USD')

  return (
    <div className={cn('mt-auto space-y-1.5', className)} {...props}>
      <div className="flex items-center gap-2">
        <span
          className={cn('font-semibold text-xl', isDiscounted ? 'text-brand' : 'text-foreground')}
        >
          {formatCurrency(price, effectiveCurrency, locale)}
        </span>
        {isDiscounted && originalPrice && (
          <span className="text-[var(--text-sm)] text-muted-foreground line-through opacity-80 font-medium">
            {formatCurrency(originalPrice, effectiveCurrency, locale)}
          </span>
        )}
        {discountPercent > 0 && <ProductBadge variant="discount">-{discountPercent}%</ProductBadge>}
      </div>
      <p className="text-[length:var(--text-micro)] text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  )
}
