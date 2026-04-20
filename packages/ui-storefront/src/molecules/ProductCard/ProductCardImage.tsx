import React, { useState } from 'react'

import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'


interface ProductCardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function ProductCardImage({ src, alt, className, ...props }: ProductCardImageProps) {
  const { title, href } = useProductCard()
  const [loaded, setLoaded] = useState(false)

  const imageContainer = (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted via-muted/70 to-muted/40">
      <img
        src={src || '/placeholder.jpg'}
        alt={alt || title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'w-full h-full object-cover',
          'transition-opacity duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'will-change-opacity',
          loaded ? 'opacity-100' : 'opacity-0',
          'group-hover:scale-[1.04] transition-transform duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
          className,
        )}
        {...props}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block relative">
        {imageContainer}
      </a>
    )
  }
  return <div className="block relative">{imageContainer}</div>
}