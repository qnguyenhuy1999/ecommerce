'use client'

import { useEffect } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton } from '@ecom/ui'

// ─── Client leaf: keyboard nav + arrow controls ───────────────────────────────
interface ProductGalleryClientProps {
  imageCount: number
  onNext: () => void
  onPrev: () => void
  showControls: boolean
}

export function ProductGalleryClient({
  imageCount,
  onNext,
  onPrev,
  showControls,
}: ProductGalleryClientProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev])

  if (!showControls || imageCount <= 1) return null

  return (
    <>
      {/* Left arrow */}
      <div className="absolute inset-y-0 left-4 flex items-center opacity-0 transition-opacity duration-[var(--motion-normal)] group-hover:opacity-100 group-focus-within:opacity-100">
        <IconButton
          icon={<ChevronLeft className="w-5 h-5" />}
          label="Previous image"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="border border-border/60 bg-background/88 backdrop-blur shadow-[var(--elevation-floating)] hover:bg-background transition-all"
        />
      </div>
      {/* Right arrow */}
      <div className="absolute inset-y-0 right-4 flex items-center opacity-0 transition-opacity duration-[var(--motion-normal)] group-hover:opacity-100 group-focus-within:opacity-100">
        <IconButton
          icon={<ChevronRight className="w-5 h-5" />}
          label="Next image"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="border border-border/60 bg-background/88 backdrop-blur shadow-[var(--elevation-floating)] hover:bg-background transition-all"
        />
      </div>
    </>
  )
}
