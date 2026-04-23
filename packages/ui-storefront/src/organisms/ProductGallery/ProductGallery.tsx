'use client'

import React, { useCallback, useState } from 'react'

import { Button, cn, createStrictContext } from '@ecom/ui'

import { ProductGalleryClient } from './ProductGalleryClient'

// ─── Compound Component Context ─────────────────────────────────────────────
interface ProductGalleryContextValue {
  images: { id: string; src: string; alt: string }[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  nextImage: () => void
  prevImage: () => void
}

const [ProductGalleryProvider, useProductGallery] = createStrictContext<ProductGalleryContextValue>('ProductGallery')
export { useProductGallery }

// ─── Root (server — state lives here, delegating to client leafs) ──────────
export interface ProductGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { id: string; src: string; alt: string }[]
  initialIndex?: number
}

function ProductGalleryRoot({
  images,
  initialIndex = 0,
  className,
  children,
  ...props
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  return (
    <ProductGalleryProvider
      value={{ images, activeIndex, setActiveIndex, nextImage, prevImage }}
    >
      <div className={cn('flex flex-col md:flex-row gap-4', className)} {...props}>
        {children}
      </div>
    </ProductGalleryProvider>
  )
}

// ─── Main Image ──────────────────────────────────────────────────────────────
export interface ProductGalleryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  showControls?: boolean
}

function ProductGalleryMain({ className, showControls = true, ...props }: ProductGalleryMainProps) {
  const { images, activeIndex, nextImage, prevImage } = useProductGallery()
  const activeImage = images[activeIndex]

  if (!activeImage) return null

  return (
    <div
      className={cn(
        'group relative aspect-square md:aspect-[4/5] flex-1 bg-muted rounded-[var(--radius-lg)] overflow-hidden cursor-crosshair',
        className,
      )}
      {...props}
    >
      <img
        key={activeImage.id}
        src={activeImage.src}
        alt={activeImage.alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 animate-in fade-in"
      />

      <ProductGalleryClient
        imageCount={images.length}
        onNext={nextImage}
        onPrev={prevImage}
        showControls={showControls}
      />
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
        'flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none',
        direction === 'vertical' ? 'md:flex-col md:w-20 lg:w-24 shrink-0' : 'flex-row',
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
              'relative snap-start shrink-0 aspect-square rounded-[var(--radius-md)] overflow-hidden',
              'h-auto min-h-0 min-w-0 p-0 bg-transparent hover:bg-transparent',
              'transition-all duration-[var(--motion-fast)]',
              direction === 'vertical' ? 'w-20 md:w-full' : 'w-20',
              isActive
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                : 'ring-1 ring-border hover:ring-foreground/50 opacity-70 hover:opacity-100',
            )}
            onClick={() => setActiveIndex(idx)}
            aria-label={`View ${image.alt}`}
            aria-pressed={isActive}
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
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
