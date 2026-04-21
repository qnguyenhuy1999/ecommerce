import React, { useState } from 'react'

import { ArrowRight, ImageOff } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface CategoryCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string
  image: string
  href: string
  itemCount?: number
}

function CategoryCard({ title, image, href, itemCount, className, ...props }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <a href={href} className={cn('category-card group bg-muted', className)} {...props}>
      {/* Image with zoom on hover */}
      {imgError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageOff className="w-10 h-10 text-muted-foreground/30" />
        </div>
      ) : (
        <img src={image} alt={title} loading="lazy" onError={() => setImgError(true)} />
      )}

      {/* Overlay — dark gradient for text legibility */}
      <div className="category-card__overlay">
        <div className="flex flex-1 flex-col gap-1">
          <h3
            className={cn(
              'font-bold tracking-tight text-[var(--brand-500)]',
              'text-[length:var(--text-xl)]',
              '[text-shadow:0_1px_6px_rgb(0_0_0/0.6)]',
              'group-hover:scale-[1.03]',
              'transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
              'origin-bottom-left',
            )}
          >
            {title}
          </h3>
          {itemCount !== undefined && (
            <p className="text-[var(--text-sm)] font-medium text-white/75 [text-shadow:0_1px_4px_rgb(0_0_0/0.5)]">
              {itemCount.toLocaleString()} Items
            </p>
          )}
        </div>

        {/* Arrow indicator — appears on hover */}
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            'bg-white/15 backdrop-blur-sm border border-white/25',
            'opacity-0 translate-x-2',
            'group-hover:opacity-100 group-hover:translate-x-0',
            'transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-out)]',
          )}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </a>
  )
}

export { CategoryCard }
