import React from 'react'

import { Button, cn } from '@ecom/ui'

import type { ProductBadgeProps } from '../../atoms/Badge/Badge'
import { ProductBadge } from '../../atoms/Badge/Badge'
import {
  ProductCard,
  ProductCardActions,
  ProductCardBadge,
  ProductCardContent,
  ProductCardImage,
  ProductCardMeta,
  ProductCardPrice,
  ProductCardRating,
  ProductCardTitle,
} from './ProductCard'

export interface ProductCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  title?: string
  href?: string
  image?: string
  price?: number
  originalPrice?: number
  badge?: React.ReactNode
  badgeVariant?: ProductBadgeProps['variant']
  rating?: number
  ratingCount?: number
  buyCount?: number
  onAddToCart?: (id: string) => void
  loading?: boolean
  view?: 'grid' | 'list'
  /** On grid view, only show the action row on hover (desktop) for a cleaner card surface. */
  hoverRevealActions?: boolean
}

function formatCompactCount(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function ProductCardItem({
  id = '',
  title = '',
  href,
  image,
  price,
  originalPrice,
  badge,
  badgeVariant,
  rating,
  ratingCount,
  buyCount,
  onAddToCart,
  loading,
  className,
  view = 'grid',
  hoverRevealActions = false,
  ...props
}: ProductCardItemProps) {
  return (
    <ProductCard
      id={id}
      title={title}
      href={href}
      loading={loading}
      className={className}
      view={view}
      {...props}
    >
      <ProductCardImage src={image ?? ''} alt={title} />

      {(badge !== undefined || badgeVariant !== undefined) && (
        <ProductCardBadge>
          {typeof badge === 'string' ||
          typeof badge === 'number' ||
          (badge === undefined && badgeVariant) ? (
            <ProductBadge variant={badgeVariant || 'new'}>{badge}</ProductBadge>
          ) : (
            badge
          )}
        </ProductCardBadge>
      )}

      <ProductCardContent>
        <div className="space-y-[var(--space-2)]">
          <ProductCardTitle />

          {(typeof rating === 'number' || typeof buyCount === 'number') && (
            <ProductCardMeta>
              {typeof rating === 'number' && (
                <ProductCardRating value={rating} count={ratingCount} />
              )}
              {typeof buyCount === 'number' && (
                <span className={cn('tabular-nums', typeof rating === 'number' && 'pl-1')}>
                  {typeof rating === 'number' ? '· ' : ''}
                  {formatCompactCount(buyCount)} sold
                </span>
              )}
            </ProductCardMeta>
          )}
        </div>

        {typeof price === 'number' && (
          <ProductCardPrice price={price} originalPrice={originalPrice} />
        )}
      </ProductCardContent>

      {onAddToCart && (
        <ProductCardActions hoverReveal={hoverRevealActions}>
          <Button
            size={view === 'list' ? 'default' : 'sm'}
            variant="brand"
            fullWidth={view === 'grid'}
            onClick={() => onAddToCart(id)}
            disabled={loading || !id}
          >
            Add to cart
          </Button>
          {view === 'list' && (
            <Button variant="outline" size="default">
              View details
            </Button>
          )}
        </ProductCardActions>
      )}
    </ProductCard>
  )
}

export { ProductCardItem }
