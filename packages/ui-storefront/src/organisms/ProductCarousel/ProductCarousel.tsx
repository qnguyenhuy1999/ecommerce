import React from 'react'

import { ProductCarouselClient } from './ProductCarouselClient'
import type { Product } from '../ProductGrid/types'

// ─── Root (server — accepts same props, delegates to client leaf) ─────────────
export interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
  onAddToCart?: (id: string) => void
}

function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
  onAddToCart,
  className,
  ...props
}: ProductCarouselProps) {
  return (
    <ProductCarouselClient
      title={title}
      subtitle={subtitle}
      products={products}
      viewAllHref={viewAllHref}
      onAddToCart={onAddToCart}
      className={className}
      {...props}
    />
  )
}

export { ProductCarousel }
