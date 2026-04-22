import React from 'react'

import { Button, cn } from '@ecom/ui'

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

      {badge &&
        (typeof badge === 'string' ? (
          <ProductCardBadge>
            <Badge>{badge}</Badge>
          </ProductCardBadge>
        ) : (
          <ProductCardBadge>{badge}</ProductCardBadge>
        ))}

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
