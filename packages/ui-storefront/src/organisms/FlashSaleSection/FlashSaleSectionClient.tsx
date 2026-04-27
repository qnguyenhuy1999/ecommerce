'use client'

import React from 'react'

import { Flame, Timer } from 'lucide-react'

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <span className="inline-flex items-center gap-2 text-[var(--text-primary)]">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--brand-500-rgb)/0.12)] text-[var(--brand-600)]">
          <Flame className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        </span>
        {title}
      </span>
      <div
        aria-label={`Ends in ${paddedHours}:${paddedMinutes}:${paddedSeconds}`}
        className="flex items-center gap-2"
      >
        <span className="inline-flex items-center gap-1 text-[length:var(--text-xs)] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
          Ends in
        </span>
        <div className="flex items-center gap-1 font-mono text-[length:var(--text-base)] tabular-nums">
          <span className="rounded-[var(--radius-md)] bg-[var(--text-primary)] px-2 py-1 text-sm font-bold text-[var(--surface-base)] shadow-[var(--elevation-card)]">
            {paddedHours}
          </span>
          <span className="font-bold text-[var(--text-primary)]">:</span>
          <span className="rounded-[var(--radius-md)] bg-[var(--text-primary)] px-2 py-1 text-sm font-bold text-[var(--surface-base)] shadow-[var(--elevation-card)]">
            {paddedMinutes}
          </span>
          <span className="font-bold text-[var(--text-primary)]">:</span>
          <span
            className={cn(
              'rounded-[var(--radius-md)] px-2 py-1 text-sm font-bold shadow-[var(--elevation-card)]',
              'bg-[var(--brand-500)] text-white',
              'animate-pulse',
            )}
          >
            {paddedSeconds}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('relative w-full', className)} {...props}>
      <ProductCarouselClient
        title={titleWithTimer as unknown as string}
        subtitle={subtitle}
        products={products}
        viewAllHref={viewAllHref}
        onAddToCart={onAddToCart}
      />
    </div>
  )
}

export { FlashSaleSectionClient }
