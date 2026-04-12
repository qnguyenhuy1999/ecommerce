import type { ProductGridProps, Product } from './types'

import React from 'react'

import { cn } from '@ecom/ui'

import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
} from '../../molecules/product-card'

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ products, loading, emptyMessage = 'No products found.', className }, ref) => {
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
            <ProductCard key={i} id="" title="">
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
          className={cn('flex items-center justify-center py-16 text-muted-foreground', className)}
        >
          <p className="text-sm">{emptyMessage}</p>
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
            </ProductCardContent>
          </ProductCard>
        ))}
      </div>
    )
  },
)
ProductGrid.displayName = 'ProductGrid'

export { ProductGrid }
export type { ProductGridProps, Product }
