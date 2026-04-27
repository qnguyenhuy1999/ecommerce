'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { X, ZoomIn, ZoomOut } from 'lucide-react'

import { cn, IconButton } from '@ecom/ui'

interface ProductGalleryZoomModalProps {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

export function ProductGalleryZoomModal({ src, alt, open, onClose }: ProductGalleryZoomModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.5, 4))
      if (e.key === '-') setScale((s) => Math.max(s - 0.5, 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return
      setIsDragging(true)
      dragStart.current = { x: e.clientX, y: e.clientY }
      posStart.current = { ...position }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setPosition({
        x: posStart.current.x + dx,
        y: posStart.current.y + dy,
      })
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (!open) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-black/90 backdrop-blur-sm',
        'animate-in fade-in duration-200',
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && scale <= 1) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target === e.currentTarget && scale <= 1) onClose()
        }
      }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Zoomed view of ${alt}`}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <IconButton
          icon={<ZoomIn className="w-5 h-5" />}
          label="Zoom in"
          onClick={() => setScale((s) => Math.min(s + 0.5, 4))}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
        />
        <IconButton
          icon={<ZoomOut className="w-5 h-5" />}
          label="Zoom out"
          onClick={() => setScale((s) => Math.max(s - 0.5, 1))}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
        />
        <IconButton
          icon={<X className="w-5 h-5" />}
          label="Close zoom"
          onClick={onClose}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
        />
      </div>

      {/* Zoom level indicator */}
      {scale > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Image */}
      <div
        className={cn(
          'max-w-[90vw] max-h-[90vh] overflow-hidden',
          scale > 1 ? 'cursor-grab' : 'cursor-zoom-out',
          isDragging && 'cursor-grabbing',
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="presentation"
      >
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          draggable={false}
        />
      </div>
    </div>
  )
}
