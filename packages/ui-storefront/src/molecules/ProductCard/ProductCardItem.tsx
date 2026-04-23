import React from 'react'

import { Button, cn } from '@ecom/ui'

import type { StorefrontBadgeProps } from '../../atoms/Badge/Badge'
import { Badge } from '../../atoms/Badge/Badge'
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
  badgeVariant?: StorefrontBadgeProps['variant']
  rating?: number
  ratingCount?: number
  buyCount?: number
  onAddToCart?: (id: string) => void
  loading?: boolean
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
  ...props
}: ProductCardItemProps) {
  return (
    <ProductCard
      id={id}
      title={title}
      href={href}
      loading={loading}
      className={className}
      {...props}
    >
      <ProductCardImage src={image ?? ''} alt={title} />

      {(badge !== undefined || badgeVariant !== undefined) && (
        <ProductCardBadge>
          {typeof badge === 'string' || typeof badge === 'number' || (badge === undefined && badgeVariant) ? (
            <Badge variant={badgeVariant || 'new'}>{badge}</Badge>
          ) : (
            badge
          )}
        </ProductCardBadge>
      )}

      <ProductCardContent>
        <ProductCardTitle />

        {(typeof rating === 'number' || typeof buyCount === 'number') && (
          <ProductCardMeta className="mt-1">
            {typeof rating === 'number' && <ProductCardRating value={rating} count={ratingCount} />}
            {typeof buyCount === 'number' && (
              <span className={cn('tabular-nums', typeof rating === 'number' && 'pl-1')}>
                {typeof rating === 'number' ? '· ' : ''}
                {formatCompactCount(buyCount)} bought
              </span>
            )}
          </ProductCardMeta>
        )}

        {typeof price === 'number' && (
          <ProductCardPrice price={price} originalPrice={originalPrice} />
        )}
      </ProductCardContent>

      {onAddToCart && (
        <ProductCardActions>
          <Button size="sm" onClick={() => onAddToCart(id)} disabled={loading || !id}>
            Add to Cart
          </Button>
        </ProductCardActions>
      )}
    </ProductCard>
  )
}

export { ProductCardItem }
