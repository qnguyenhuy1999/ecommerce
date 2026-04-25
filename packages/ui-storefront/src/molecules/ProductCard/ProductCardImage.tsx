import React, { useState } from 'react'

import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export function ProductCardImage({ src, alt, className, ...props }: ProductCardImageProps) {
  const { title, href, view } = useProductCard()
  const [loaded, setLoaded] = useState(false)

  const imageContainer = (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-muted via-muted/70 to-muted/40',
        view === 'list'
          ? 'h-full min-h-[14rem] w-full sm:w-[15rem] lg:w-[16rem]'
          : 'aspect-[4/3] w-full',
      )}
    >
      <img
        src={src || '/placeholder.jpg'}
        alt={alt || title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover',
          'transition-[opacity,transform] duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'will-change-transform',
          loaded ? 'opacity-100' : 'opacity-0',
          'group-hover:scale-[1.04]',
          className,
        )}
        {...props}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </div>
  )

  if (href) {
    return (
      <a href={href} className={cn('relative block', view === 'list' && 'shrink-0')}>
        {imageContainer}
      </a>
    )
  }
  return <div className={cn('relative block', view === 'list' && 'shrink-0')}>{imageContainer}</div>
}
