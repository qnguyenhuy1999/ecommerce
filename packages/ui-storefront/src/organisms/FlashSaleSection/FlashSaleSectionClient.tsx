'use client'

import React from 'react'

import { Timer } from 'lucide-react'

import { cn } from '@ecom/ui'
import { useCountdown } from '../../hooks/useCountdown'
import { ProductCarouselClient } from '../ProductCarousel/ProductCarouselClient'
import type { Product } from '../ProductGrid/types'

export interface FlashSaleSectionClientProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  targetDate: Date
  products: Product[]
  viewAllHref?: string
  onAddToCart?: (id: string) => void
}

function FlashSaleSectionClient({
  title,
  subtitle,
  targetDate,
  products,
  viewAllHref,
  onAddToCart,
  className,
  ...props
}: FlashSaleSectionClientProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown({ targetDate })

  if (isExpired) {
    return null
  }

  const paddedHours = String(hours).padStart(2, '0')
  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(seconds).padStart(2, '0')

  const titleWithTimer = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="flex items-center gap-2 text-destructive">
        <Timer className="w-6 h-6 md:w-7 md:h-7" />
        {title}
      </span>
      <div className="flex items-center gap-1.5 font-mono text-lg tabular-nums">
        <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm md:text-base font-bold shadow-sm">
          {paddedHours}
        </span>
        <span className="text-destructive font-bold">:</span>
        <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm md:text-base font-bold shadow-sm">
          {paddedMinutes}
        </span>
        <span className="text-destructive font-bold">:</span>
        <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm md:text-base font-bold shadow-sm">
          {paddedSeconds}
        </span>
      </div>
    </div>
  )

  return (
    <div
      className={cn('relative max-w-[var(--storefront-content-max-width)] mx-auto', className)}
      {...props}
    >
      <div className="absolute inset-x-4 inset-y-0 bg-destructive/5 rounded-3xl -z-10" />
      <ProductCarouselClient
        title={titleWithTimer as unknown as string}
        subtitle={subtitle}
        products={products}
        viewAllHref={viewAllHref}
        onAddToCart={onAddToCart}
        className="py-10"
      />
    </div>
  )
}

export { FlashSaleSectionClient }
