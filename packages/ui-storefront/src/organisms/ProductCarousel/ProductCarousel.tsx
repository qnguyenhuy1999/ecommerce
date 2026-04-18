'use client'

import React from 'react'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button, cn } from '@ecom/ui'

export interface ProductCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  products: React.ReactNode[] // Array of ProductCard components
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
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.querySelector('div')?.clientWidth ?? 300
      const scrollAmount = direction === 'left' ? -itemWidth * 2 : itemWidth * 2
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn('w-full py-10', className)} {...props}>
      {/* Header */}
      <div className="flex items-end justify-between mb-7 px-4 md:px-8 max-w-[var(--storefront-content-max-width)] mx-auto w-full">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 group hidden sm:flex transition-colors duration-[var(--motion-fast)]"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-[var(--motion-fast)]" />
            </a>
          )}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-[var(--motion-fast)]',
                !canScrollLeft && 'opacity-40 pointer-events-none',
              )}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-[var(--motion-fast)]',
                !canScrollRight && 'opacity-40 pointer-events-none',
              )}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Track */}
      <div className="relative">
        {/* Left fade mask */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        )}
        {/* Right fade mask */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
        )}

        <div
          ref={scrollRef}
          className={cn(
            'flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory py-4 px-4 md:px-8',
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          )}
        >
          {products.map((product, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[min(82vw,17rem)] sm:w-[15.5rem] md:w-[17rem] lg:w-[18.5rem] snap-start"
            >
              {product}
            </div>
          ))}
          {/* Right-edge breathing room */}
          <div className="shrink-0 w-4 md:w-8 snap-end" aria-hidden />
        </div>
      </div>
    </div>
  )
}

export { ProductCarousel }

