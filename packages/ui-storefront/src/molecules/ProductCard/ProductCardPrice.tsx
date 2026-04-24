import { formatCurrency } from '@ecom/shared/utils/formatters'

import { cn } from '@ecom/ui'

import { ProductBadge } from '../../atoms/Badge/Badge'
import { useProductCard } from './ProductCard'

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
  const { view } = useProductCard()
  const isDiscounted = originalPrice && originalPrice > price
  const discountPercent =
    isDiscounted && originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const effectiveCurrency = currencyCode || (/^[A-Z]{3}$/.test(currency) ? currency : 'USD')

  return (
    <div className={cn(view === 'list' ? 'mt-4 space-y-2' : 'mt-auto space-y-1.5', className)} {...props}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={cn(
            'font-bold tracking-tight text-foreground tabular-nums',
            isDiscounted ? 'text-brand' : 'text-foreground',
            view === 'list' ? 'text-[var(--font-size-heading-md)]' : 'text-xl',
          )}
        >
          {formatCurrency(price, effectiveCurrency, locale)}
        </span>
        {isDiscounted && originalPrice && (
          <span className="text-[var(--text-sm)] font-medium text-muted-foreground line-through opacity-80">
            {formatCurrency(originalPrice, effectiveCurrency, locale)}
          </span>
        )}
        {discountPercent > 0 && (
          <ProductBadge variant="discount">Save {discountPercent}%</ProductBadge>
        )}
      </div>
      <p className="text-[length:var(--text-micro)] text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  )
}
