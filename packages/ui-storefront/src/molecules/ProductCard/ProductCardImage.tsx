import React, { useState } from 'react'

import { cn } from '@ecom/ui/utils'

import { useProductCard } from './ProductCard'

type ProductCardImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export function ProductCardImage({ src, alt, className, ...props }: ProductCardImageProps) {
  const { title, href, view } = useProductCard()
  const [loaded, setLoaded] = useState(false)

  const imageContainer = (
    <div
      className={cn(
        'relative overflow-hidden bg-[var(--surface-muted)]',
        view === 'list'
          ? 'h-full w-full sm:w-[14rem] lg:w-[16rem] aspect-square sm:aspect-auto'
          : 'aspect-[4/5] w-full',
      )}
    >
      <img
        src={src || '/placeholder.jpg'}
        alt={alt || title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover',
          'transition-[opacity,transform] duration-[var(--motion-slow)] ease-[var(--motion-ease-out)]',
          'will-change-transform',
          loaded ? 'opacity-100' : 'opacity-0',
          'group-hover:scale-[1.05]',
          className,
        )}
        {...props}
      />
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn('relative block focus-visible:outline-none', view === 'list' && 'shrink-0')}
      >
        {imageContainer}
      </a>
    )
  }
  return <div className={cn('relative block', view === 'list' && 'shrink-0')}>{imageContainer}</div>
}
