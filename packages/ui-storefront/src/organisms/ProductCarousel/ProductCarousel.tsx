import React from 'react'

import { ProductCarouselClient } from './ProductCarouselClient'

// ─── Root (server — accepts same props, delegates to client leaf) ─────────────
export interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  products: React.ReactNode[]
  viewAllHref?: string
}

function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
  className,
  ...props
}: ProductCarouselProps) {
  return (
    <ProductCarouselClient
      title={title}
      subtitle={subtitle}
      products={products}
      viewAllHref={viewAllHref}
      className={className}
      {...props}
    />
  )
}

export { ProductCarousel }
