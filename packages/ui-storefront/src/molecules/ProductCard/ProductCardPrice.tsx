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
    <div
      className={cn(
        view === 'list' ? 'mt-[var(--space-3)]' : 'mt-auto',
        'flex flex-wrap items-baseline gap-x-[var(--space-2)] gap-y-[var(--space-1)]',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'font-bold tracking-tight tabular-nums leading-none',
          isDiscounted ? 'text-[var(--text-brand)]' : 'text-foreground',
          view === 'list'
            ? 'text-[length:var(--font-size-heading-md)]'
            : 'text-[length:var(--font-size-heading-sm)]',
        )}
      >
        {formatCurrency(price, effectiveCurrency, locale)}
      </span>
      {isDiscounted && originalPrice && (
        <span className="text-[length:var(--text-sm)] font-medium text-[var(--text-tertiary)] line-through tabular-nums">
          {formatCurrency(originalPrice, effectiveCurrency, locale)}
        </span>
      )}
      {discountPercent > 0 && (
        <ProductBadge variant="discount" className="ml-[var(--space-1)]">
          -{discountPercent}%
        </ProductBadge>
      )}
    </div>
  )
}
