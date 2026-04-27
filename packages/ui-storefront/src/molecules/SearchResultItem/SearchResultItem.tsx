import { ShoppingCart, Heart } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { Rating } from '../../atoms/Rating/Rating'

export interface SearchResultProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  brand?: string
  inStock?: boolean
}

export interface SearchResultItemProps {
  product: SearchResultProduct
  query?: string
  onQuickAdd?: (id: string) => void
  onWishlist?: (id: string) => void
  onView?: (id: string) => void
  className?: string
}

function highlightMatch(text: string, query?: string): React.ReactNode {
  if (!query || !query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-[var(--intent-warning)]/25 text-[var(--text-primary)] rounded-sm px-0.5 not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function SearchResultItem({
  product,
  query,
  onQuickAdd,
  onWishlist,
  onView,
  className,
}: SearchResultItemProps) {
  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-[var(--radius-xl)]',
        'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
        'shadow-[var(--elevation-surface)] hover:shadow-[var(--elevation-card)]',
        'transition-all duration-[var(--motion-normal)]',
        'group',
        className,
      )}
    >
      {/* Image */}
      <button
        type="button"
        onClick={() => onView?.(product.id)}
        className="shrink-0 relative w-28 h-28 sm:w-32 sm:h-32 rounded-[var(--radius-lg)] overflow-hidden bg-[var(--surface-muted)] border border-[var(--border-subtle)]"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[var(--motion-slow)] group-hover:scale-105"
          loading="lazy"
        />
        {product.inStock === false && (
          <div className="absolute inset-0 bg-[var(--surface-base)]/70 flex items-center justify-center">
            <span className="text-[length:var(--text-xs)] font-semibold text-[var(--text-secondary)] bg-[var(--surface-base)] px-2 py-1 rounded-full border border-[var(--border-subtle)]">
              Out of stock
            </span>
          </div>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div className="space-y-1">
          {product.brand && (
            <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.12em] text-[var(--action-primary)]/80">
              {product.brand}
            </p>
          )}
          <button
            type="button"
            onClick={() => onView?.(product.id)}
            className="text-left hover:text-[var(--action-primary)] transition-colors"
          >
            <h3 className="text-sm sm:text-[length:var(--text-base)] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
              {highlightMatch(product.name, query)}
            </h3>
          </button>
          {typeof product.rating === 'number' && (
            <Rating value={product.rating} count={product.reviewCount} showCount size="sm" />
          )}
        </div>

        <div className="flex items-end justify-between gap-3 flex-wrap">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="default"
          />
          <div className="flex items-center gap-2">
            {onWishlist && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onWishlist(product.id)}
                aria-label="Add to wishlist"
                className="h-9 w-9 rounded-full text-[var(--text-tertiary)] hover:text-[var(--intent-destructive)] hover:bg-[var(--intent-destructive)]/10"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
            {onQuickAdd && (
              <Button
                size="sm"
                disabled={product.inStock === false}
                onClick={() => onQuickAdd(product.id)}
                className="h-9 gap-1.5 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] rounded-[var(--radius-md)] font-semibold transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SearchResultItem }
