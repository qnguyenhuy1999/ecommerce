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
}

function formatCompactCount(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value)
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
        <div className="space-y-2.5">
          <ProductCardTitle />

          {(typeof rating === 'number' || typeof buyCount === 'number') && (
            <ProductCardMeta>
              {typeof rating === 'number' && (
                <ProductCardRating value={rating} count={ratingCount} />
              )}
              {typeof buyCount === 'number' && (
                <span className={cn('tabular-nums', typeof rating === 'number' && 'pl-1')}>
                  {typeof rating === 'number' ? '· ' : ''}
                  {formatCompactCount(buyCount)} bought
                </span>
              )}
            </ProductCardMeta>
          )}
        </div>

        {typeof price === 'number' && (
          <ProductCardPrice price={price} originalPrice={originalPrice} />
        )}

        {onAddToCart && (
          <ProductCardActions>
            <Button
              size={view === 'list' ? 'default' : 'sm'}
              variant="brand"
              className={cn(
                view === 'list' ? 'min-w-[10rem]' : 'shadow-[var(--elevation-floating)]',
              )}
              onClick={() => onAddToCart(id)}
              disabled={loading || !id}
            >
              Add to Cart
            </Button>
            {view === 'list' && (
              <Button variant="outline" size="default">
                View details
              </Button>
            )}
          </ProductCardActions>
        )}
      </ProductCardContent>
    </ProductCard>
  )
}

export { ProductCardItem }
