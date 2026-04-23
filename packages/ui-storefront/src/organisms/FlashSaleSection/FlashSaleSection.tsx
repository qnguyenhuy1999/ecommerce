import React from 'react'

import type { Product } from '../ProductGrid/types'
import { FlashSaleSectionClient } from './FlashSaleSectionClient'

export interface FlashSaleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  targetDate: Date
  products: Product[]
  viewAllHref?: string
  onAddToCart?: (id: string) => void
}

function FlashSaleSection({
  title = 'Flash Sale',
  subtitle,
  targetDate,
  products,
  viewAllHref,
  onAddToCart,
  className,
  ...props
}: FlashSaleSectionProps) {
  return (
    <FlashSaleSectionClient
      title={title}
      subtitle={subtitle}
      targetDate={targetDate}
      products={products}
      viewAllHref={viewAllHref}
      onAddToCart={onAddToCart}
      className={className}
      {...props}
    />
  )
}

export { FlashSaleSection }
