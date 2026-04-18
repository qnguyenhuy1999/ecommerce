import React from 'react'

import { ShoppingBag } from 'lucide-react'

import { cn, Button } from '@ecom/ui'

import type { ProductGridProps, Product } from './types'
import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
  ProductCardPrice,
  ProductCardActions,
  ProductCardRating,
} from '../../molecules/ProductCard/ProductCard'

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ products, loading, onAddToCart, emptyMessage = 'No products found.', className }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            className,
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={i} id="" title="" loading>
              <ProductCardImage src="" alt="" />
              <ProductCardContent />
            </ProductCard>
          ))}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center py-24 gap-5 text-muted-foreground',
            className,
          )}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground mb-1">Nothing here yet</p>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
          className,
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} id={product.id} title={product.title}>
            <ProductCardImage src={product.image} alt={product.title} />
            {product.badge && <ProductCardBadge>{product.badge}</ProductCardBadge>}
            <ProductCardContent>
              <ProductCardTitle />
              {typeof product.rating === 'number' && (
                <ProductCardRating value={product.rating} count={product.ratingCount} />
              )}
              <ProductCardPrice price={product.price} originalPrice={product.originalPrice} />
            </ProductCardContent>
            {onAddToCart && (
              <ProductCardActions>
                <Button size="sm" onClick={() => onAddToCart(product.id)}>
                  Add to Cart
                </Button>
              </ProductCardActions>
            )}
          </ProductCard>
        ))}
      </div>
    )
  },
)
ProductGrid.displayName = 'ProductGrid'

export { ProductGrid }
export type { ProductGridProps, Product }
