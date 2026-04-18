'use client'

import React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn, IconButton } from '@ecom/ui'

// ─── Context ─────────────────────────────────────────────────────────────────
interface ProductGalleryContextValue {
  images: { id: string; src: string; alt: string }[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  nextImage: () => void
  prevImage: () => void
}

const ProductGalleryContext = React.createContext<ProductGalleryContextValue | null>(null)

export function useProductGallery() {
  const context = React.useContext(ProductGalleryContext)
  if (!context) {
    throw new Error('ProductGallery components must be used within <ProductGallery>')
  }
  return context
}

// ─── Root ────────────────────────────────────────────────────────────────────
export interface ProductGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { id: string; src: string; alt: string }[]
  initialIndex?: number
}

function ProductGallery({
  images,
  initialIndex = 0,
  className,
  children,
  ...props
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex)

  const nextImage = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextImage, prevImage])

  return (
    <ProductGalleryContext.Provider
      value={{ images, activeIndex, setActiveIndex, nextImage, prevImage }}
    >
      <div className={cn('flex flex-col md:flex-row gap-4', className)} {...props}>
        {children}
      </div>
    </ProductGalleryContext.Provider>
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

      {showControls && images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--motion-normal)]">
            <IconButton
              icon={<ChevronLeft className="w-5 h-5" />}
              label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="bg-background/80 backdrop-blur shadow-[var(--elevation-floating)] hover:bg-background transition-all"
            />
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--motion-normal)]">
            <IconButton
              icon={<ChevronRight className="w-5 h-5" />}
              label="Next image"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="bg-background/80 backdrop-blur shadow-[var(--elevation-floating)] hover:bg-background transition-all"
            />
          </div>
        </>
      )}
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
          <button
            key={image.id}
            className={cn(
              'relative snap-start shrink-0 aspect-square rounded-[var(--radius-md)] overflow-hidden transition-all duration-[var(--motion-fast)]',
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
          </button>
        )
      })}
    </div>
  )
}

export { ProductGallery, ProductGalleryMain, ProductGalleryThumbnails }
