'use client'

import React, { useCallback, useState } from 'react'

import { Button } from '@ecom/ui'
import { createStrictContext } from '@ecom/ui/react'
import { cn } from '@ecom/ui/utils'

import { ProductGalleryClient } from './ProductGalleryClient'
import { ProductGalleryZoomModal } from './ProductGalleryZoomModal'

// ─── Compound Component Context ─────────────────────────────────────────────
interface ProductGalleryContextValue {
  images: { id: string; src: string; alt: string }[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  nextImage: () => void
  prevImage: () => void
  openZoom: () => void
}

const [ProductGalleryProvider, useProductGallery] =
  createStrictContext<ProductGalleryContextValue>('ProductGallery')
export { useProductGallery }

// ─── Root (server — state lives here, delegating to client leafs) ──────────
export interface ProductGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { id: string; src: string; alt: string }[]
  initialIndex?: number
  enableZoom?: boolean
}

function ProductGalleryRoot({
  images,
  initialIndex = 0,
  enableZoom = true,
  className,
  children,
  ...props
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [zoomOpen, setZoomOpen] = useState(false)

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const openZoom = useCallback(() => {
    if (enableZoom) setZoomOpen(true)
  }, [enableZoom])

  const activeImage = images[activeIndex]

  return (
    <ProductGalleryProvider
      value={{ images, activeIndex, setActiveIndex, nextImage, prevImage, openZoom }}
    >
      <div className={cn('flex flex-col gap-3 md:flex-row', className)} {...props}>
        {children}
      </div>

      {/* Zoom Modal */}
      {enableZoom && activeImage && (
        <ProductGalleryZoomModal
          src={activeImage.src}
          alt={activeImage.alt}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </ProductGalleryProvider>
  )
}

// ─── Main Image ──────────────────────────────────────────────────────────────
export interface ProductGalleryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  showControls?: boolean
}

function ProductGalleryMain({ className, showControls = true, ...props }: ProductGalleryMainProps) {
  const { images, activeIndex, nextImage, prevImage, openZoom } = useProductGallery()
  const activeImage = images[activeIndex]

  if (!activeImage) return null

  return (
    <div
      className={cn(
        'group relative aspect-square md:aspect-[4/5] flex-1 overflow-hidden rounded-[var(--radius-xl)] border border-border/60 bg-[var(--surface-elevated)] shadow-[var(--elevation-dropdown)] cursor-crosshair',
        className,
      )}
      onClick={openZoom}
      role="button"
      tabIndex={0}
      aria-label="Click to zoom image"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openZoom()
        }
      }}
      {...props}
    >
      <img
        key={activeImage.id}
        src={activeImage.src}
        alt={activeImage.alt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08] animate-in fade-in"
        loading={activeIndex === 0 ? 'eager' : 'lazy'}
      />

      <ProductGalleryClient
        imageCount={images.length}
        onNext={nextImage}
        onPrev={prevImage}
        showControls={showControls}
      />

      {/* Dot indicators for mobile */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all duration-200',
              activeIndex === idx ? 'bg-white w-4' : 'bg-white/50',
            )}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Thumbnails ──────────────────────────────────────────────────────────────
export interface ProductGalleryThumbnailsProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
}

function ProductGalleryThumbnails({
  direction = 'vertical',
  className,
  ...props
}: ProductGalleryThumbnailsProps) {
  const { images, activeIndex, setActiveIndex } = useProductGallery()

  return (
    <div
      className={cn(
        'flex gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-none',
        direction === 'vertical'
          ? 'md:w-20 md:flex-col shrink-0 order-last md:order-first'
          : 'flex-row',
        className,
      )}
      {...props}
    >
      {images.map((image, idx) => {
        const isActive = activeIndex === idx
        return (
          <Button
            key={image.id}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'relative snap-start shrink-0 aspect-square rounded-[var(--radius-md)] overflow-hidden border-2',
              'h-auto min-h-0 min-w-0 p-0 bg-transparent hover:bg-transparent',
              'transition-all duration-[var(--motion-fast)]',
              direction === 'vertical' ? 'w-16 md:w-full' : 'w-16',
              isActive
                ? 'border-brand opacity-100'
                : 'border-border/70 opacity-60 hover:border-foreground/50 hover:opacity-100',
            )}
            onClick={() => setActiveIndex(idx)}
            aria-label={`View ${image.alt}`}
            aria-pressed={isActive}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Button>
        )
      })}
    </div>
  )
}

const ProductGallery = Object.assign(ProductGalleryRoot, {
  Main: ProductGalleryMain,
  Thumbnails: ProductGalleryThumbnails,
})

export { ProductGallery, ProductGalleryMain, ProductGalleryThumbnails }
