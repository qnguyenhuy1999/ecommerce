import React from 'react'

import { ShoppingBag } from 'lucide-react'

import { cn } from '@ecom/ui'

import type { ProductGridProps, Product } from './types'
import { ProductCardItem } from '../../molecules/ProductCard/ProductCardItem'

function getGridClasses(view: 'grid' | 'list') {
  return view === 'list'
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  (
    {
      products,
      loading,
      onAddToCart,
      emptyMessage = 'No products found.',
      className,
      view = 'grid',
      loadingCount = 8,
    },
    ref,
  ) => {
    const gridClasses = getGridClasses(view)

    if (loading) {
      return (
        <div ref={ref} className={cn(gridClasses, className)}>
          {Array.from({ length: loadingCount }).map((_, i) => (
            <ProductCardItem key={i} loading view={view} />
          ))}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center gap-5 rounded-[var(--radius-xl)] border border-dashed border-border/70 bg-[var(--surface-elevated)] px-6 py-24 text-muted-foreground',
            className,
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--action-muted)] text-brand shadow-[var(--elevation-xs)]">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div className="text-center">
            <p className="mb-1 text-base font-semibold text-foreground">Nothing here yet</p>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn(gridClasses, className)}>
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
            view={view}
          />
        ))}
      </div>
    )
  },
)
ProductGrid.displayName = 'ProductGrid'

export { ProductGrid }
export type { ProductGridProps, Product }
