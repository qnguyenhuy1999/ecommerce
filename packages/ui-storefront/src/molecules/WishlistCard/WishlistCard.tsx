import { Heart, ShoppingCart, ExternalLink } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { Rating } from '../../atoms/Rating/Rating'
import { StockBadge } from '../../atoms/StockBadge/StockBadge'

export interface WishlistProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  inStock: boolean
  stockCount?: number
  rating?: number
  reviewCount?: number
  brand?: string
}

export interface WishlistCardProps {
  product: WishlistProduct
  onAddToCart?: (id: string) => void
  onRemove?: (id: string) => void
  onViewProduct?: (id: string) => void
  className?: string
}

function WishlistCard({
  product,
  onAddToCart,
  onRemove,
  onViewProduct,
  className,
}: WishlistCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col',
        'rounded-[var(--radius-xl)] border border-[var(--border-subtle)]',
        'bg-[var(--surface-base)] shadow-[var(--elevation-surface)]',
        'hover:shadow-[var(--elevation-card)] transition-all duration-[var(--motion-normal)]',
        'overflow-hidden',
        className,
      )}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className={cn(
            'absolute top-3 right-3 z-10',
            'w-8 h-8 rounded-full flex items-center justify-center',
            'bg-[var(--surface-base)]/90 backdrop-blur-sm',
            'border border-[var(--border-subtle)]',
            'text-[var(--text-tertiary)] hover:text-[var(--intent-destructive)]',
            'hover:border-[var(--intent-destructive)]/40 hover:bg-[var(--intent-destructive)]/10',
            'transition-all duration-[var(--motion-fast)]',
            'shadow-sm',
          )}
        >
          <Heart className="w-4 h-4 fill-[var(--intent-destructive)] text-[var(--intent-destructive)]" />
        </button>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--surface-muted)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[var(--motion-slow)] group-hover:scale-105"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-[var(--surface-base)]/60 flex items-center justify-center">
            <span className="text-[var(--text-sm)] font-semibold text-[var(--text-secondary)] bg-[var(--surface-base)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)]">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {product.brand && (
          <p className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.12em] text-[var(--action-primary)]/80">
            {product.brand}
          </p>
        )}

        <button type="button" onClick={() => onViewProduct?.(product.id)} className="text-left">
          <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug hover:text-[var(--action-primary)] transition-colors">
            {product.name}
          </h3>
        </button>

        {typeof product.rating === 'number' && (
          <Rating value={product.rating} count={product.reviewCount} showCount size="sm" />
        )}

        <div className="flex items-center justify-between gap-2 mt-auto">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="default"
          />
          <StockBadge
            status={product.inStock ? 'in-stock' : 'out-of-stock'}
            count={product.stockCount}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 h-9 gap-1.5 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] rounded-[var(--radius-md)] font-semibold transition-all disabled:opacity-50"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.inStock ? 'Add to Cart' : 'Notify Me'}
          </Button>
          {onViewProduct && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProduct(product.id)}
              className="h-9 w-9 p-0 rounded-[var(--radius-md)] shrink-0"
              aria-label="View product"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { WishlistCard }
