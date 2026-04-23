import React from 'react'

import { ShoppingBag } from 'lucide-react'

import { cn } from '@ecom/ui'

import type { ProductGridProps, Product } from './types'
import { ProductCardItem } from '../../molecules/ProductCard/ProductCardItem'

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
            <ProductCardItem key={i} loading />
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
          <ProductCardItem
            key={product.id}
            id={product.id}
            title={product.title}
            image={product.image}
            badge={product.badge}
            badgeVariant={product.badgeVariant}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            ratingCount={product.ratingCount}
            buyCount={product.buyCount}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    )
  },
)
ProductGrid.displayName = 'ProductGrid'

export { ProductGrid }
export type { ProductGridProps, Product }
