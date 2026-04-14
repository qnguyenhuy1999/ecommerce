'use client'

import React from 'react'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

export interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  products: React.ReactNode[] // Array of ProductCard components
  viewAllHref?: string
}

function ProductCarousel({
  title,
  products,
  viewAllHref,
  className,
  ...props
}: ProductCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn('w-full py-8', className)} {...props}>
      <div className="flex items-end justify-between mb-6 px-4 md:px-8 max-w-[var(--storefront-content-max-width)] mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>

        <div className="flex items-center gap-4">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1 group hidden sm:flex"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-background"
              onClick={() => {
                scroll('left')
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-background"
              onClick={() => {
                scroll('right')
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className={cn(
            'flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-4 md:px-8',
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
          )}
        >
          {products.map((product, idx) => (
            <div key={idx} className="shrink-0 w-[240px] sm:w-[280px] md:w-[320px] snap-start">
              {product}
            </div>
          ))}
          {/* Spacer for right edge alignment */}
          <div className="shrink-0 w-4 md:w-8 snap-end" />
        </div>
      </div>
    </div>
  )
}

export { ProductCarousel }
