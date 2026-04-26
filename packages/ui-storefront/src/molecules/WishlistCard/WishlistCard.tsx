import { Bell, Heart, ShoppingCart, X } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { Rating } from '../../atoms/Rating/Rating'

export interface WishlistProduct {
  id: string
  name: string
  image: string
  /** Optional secondary/lifestyle image revealed on hover for a curated, magazine feel. */
  secondaryImage?: string
  price: number
  originalPrice?: number
  inStock: boolean
  stockCount?: number
  rating?: number
  reviewCount?: number
  brand?: string
}

/**
 * Token-aligned color-blocked accents for the image surface. Each maps to a
 * variable already in the design system — no arbitrary colors. `subtle` is the
 * neutral default used when no accent is provided.
 */
export type WishlistCardAccent =
  | 'subtle'
  | 'muted'
  | 'sand'
  | 'mist'
  | 'rose'
  | 'sage'

const ACCENT_BG: Record<WishlistCardAccent, string> = {
  subtle: 'bg-[var(--surface-subtle)]',
  muted: 'bg-[var(--surface-muted)]',
  sand: 'bg-[var(--intent-warning-muted)]',
  mist: 'bg-[var(--intent-info-muted)]',
  rose: 'bg-[var(--intent-danger-muted)]',
  sage: 'bg-[var(--intent-success-muted)]',
}

export interface WishlistCardProps {
  product: WishlistProduct
  /** Token-aligned image background tint. Defaults to `subtle`. */
  accent?: WishlistCardAccent
  onAddToCart?: (id: string) => void
  /** Triggered when the user removes the item from their wishlist (heart toggle or X). */
  onRemove?: (id: string) => void
  /** Triggered for out-of-stock items when the user opts in to a back-in-stock alert. */
  onNotify?: (id: string) => void
  onViewProduct?: (id: string) => void
  /** Hide the quick-add reveal entirely (e.g. for read-only wishlist views). */
  disableQuickAdd?: boolean
  className?: string
}

function WishlistCard({
  product,
  accent = 'subtle',
  onAddToCart,
  onRemove,
  onNotify,
  onViewProduct,
  disableQuickAdd = false,
  className,
}: WishlistCardProps) {
  const inStock = product.inStock
  const showQuickAdd = !disableQuickAdd && (inStock ? Boolean(onAddToCart) : Boolean(onNotify))

  const handlePrimaryAction = () => {
    if (inStock) onAddToCart?.(product.id)
    else onNotify?.(product.id)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col',
        'rounded-[var(--radius-lg)]',
        'bg-[var(--surface-base)]',
        'border border-[var(--border-subtle)]',
        'overflow-hidden',
        'transition-shadow duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
        'hover:shadow-[var(--elevation-card)]',
        className,
      )}
    >
      <div className={cn('relative aspect-square w-full overflow-hidden', ACCENT_BG[accent])}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'transition-[transform,opacity,filter] duration-[var(--motion-slow)] ease-[var(--motion-ease-default)]',
            !inStock && 'grayscale-[55%] opacity-80',
            product.secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]',
          )}
        />
        {product.secondaryImage && (
          <img
            src={product.secondaryImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              'opacity-0 transition-opacity duration-[var(--motion-slow)] ease-[var(--motion-ease-default)]',
              'group-hover:opacity-100',
              !inStock && 'grayscale-[55%]',
            )}
          />
        )}

        {!inStock && (
          <span
            className={cn(
              'absolute left-[var(--space-3)] top-[var(--space-3)]',
              'inline-flex items-center rounded-full',
              'bg-[var(--surface-base)] px-[var(--space-2-5)] py-[var(--space-1)]',
              'text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.08em]',
              'text-[var(--text-secondary)] shadow-[var(--elevation-xs)]',
            )}
          >
            Out of stock
          </span>
        )}

        {onViewProduct && (
          <button
            type="button"
            onClick={() => onViewProduct(product.id)}
            aria-label={`View ${product.name}`}
            className={cn(
              'absolute inset-0 z-[1]',
              'cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-inset',
            )}
          />
        )}

        {showQuickAdd && (
          <div
            className={cn(
              'absolute inset-x-[var(--space-3)] bottom-[var(--space-3)] z-[2]',
              'flex items-center justify-center',
              'opacity-100 translate-y-0',
              'md:opacity-0 md:translate-y-2',
              'md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0',
              'transition-[opacity,transform] duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
            )}
          >
            <Button
              size="sm"
              onClick={handlePrimaryAction}
              className={cn(
                'h-9 w-full gap-[var(--space-1-5)]',
                'rounded-[var(--radius-full)]',
                'shadow-[var(--elevation-card)]',
              )}
            >
              {inStock ? (
                <>
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  Quick add
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Notify me
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onRemove(product.id)
          }}
          aria-label={`Remove ${product.name} from wishlist`}
          title="Remove from wishlist"
          className={cn(
            'absolute right-[var(--space-3)] top-[var(--space-3)] z-[3]',
            'inline-flex h-8 w-8 items-center justify-center rounded-full',
            'bg-[var(--surface-base)] shadow-[var(--elevation-xs)]',
            'border border-[var(--border-subtle)]',
            'text-[var(--intent-danger)]',
            'transition-[color,background,border-color,transform] duration-[var(--motion-fast)]',
            'hover:bg-[var(--intent-danger-muted)] hover:border-[var(--intent-danger)]',
            'active:scale-95',
            'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
          )}
        >
          {/* Heart visible by default, X on hover/focus — both stacked, opacity-swapped */}
          <Heart
            className={cn(
              'absolute h-4 w-4 fill-[var(--intent-danger)]',
              'transition-opacity duration-[var(--motion-fast)]',
              'group-hover:opacity-0',
            )}
            aria-hidden="true"
          />
          <X
            className={cn(
              'absolute h-4 w-4',
              'opacity-0 transition-opacity duration-[var(--motion-fast)]',
              'group-hover:opacity-100',
            )}
            aria-hidden="true"
          />
        </button>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-[var(--space-2)] p-[var(--space-4)]">
        {product.brand && (
          <p className="text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {product.brand}
          </p>
        )}

        <button
          type="button"
          onClick={() => onViewProduct?.(product.id)}
          className="text-left focus-visible:outline-none focus-visible:underline"
        >
          <h3
            className={cn(
              'line-clamp-2 text-[length:var(--text-sm)] font-semibold leading-snug',
              'text-[var(--text-primary)] hover:text-[var(--action-primary)]',
              'transition-colors duration-[var(--motion-fast)]',
            )}
          >
            {product.name}
          </h3>
        </button>

        {typeof product.rating === 'number' && (
          <Rating value={product.rating} count={product.reviewCount} showCount size="sm" />
        )}

        <div className="mt-auto flex items-center justify-between gap-[var(--space-2)] pt-[var(--space-1)]">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="default"
          />
          {!inStock && onNotify && (
            <button
              type="button"
              onClick={() => onNotify(product.id)}
              className={cn(
                'inline-flex items-center gap-[var(--space-1)] rounded-full',
                'border border-[var(--border-subtle)] bg-[var(--surface-base)]',
                'px-[var(--space-2-5)] py-[var(--space-1)]',
                'text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.08em]',
                'text-[var(--text-secondary)]',
                'transition-colors duration-[var(--motion-fast)]',
                'hover:border-[var(--border-default)] hover:text-[var(--text-primary)]',
              )}
            >
              <Bell className="h-3 w-3" aria-hidden="true" />
              Notify me
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { WishlistCard }
