import React, { useState } from 'react'

import { ArrowRight, ImageOff } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface CategoryCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string
  image: string
  href: string
  itemCount?: number
  /** Visual presentation. `feature` is taller (4/5 ratio); `default` is wide (16/10). */
  variant?: 'default' | 'feature'
}

function CategoryCard({
  title,
  image,
  href,
  itemCount,
  variant = 'default',
  className,
  ...props
}: CategoryCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={href}
      className={cn(
        'group relative isolate block overflow-hidden bg-[var(--surface-muted)]',
        'rounded-[var(--radius-xl)]',
        'transition-[transform,box-shadow] duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
        'hover:-translate-y-0.5 hover:shadow-[var(--elevation-floating)]',
        'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-base)]',
        variant === 'feature' ? 'aspect-[4/5]' : 'aspect-[16/10]',
        className,
      )}
      {...props}
    >
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)]">
          <ImageOff className="h-10 w-10 text-[var(--text-tertiary)]/50" />
        </div>
      ) : (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setImgError(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'transition-transform duration-[var(--motion-slow)] ease-[var(--motion-ease-out)]',
            'group-hover:scale-[1.05]',
          )}
        />
      )}

      <div className="category-card__overlay">
        <div className="flex flex-1 flex-col gap-[var(--space-1)]">
          <h3
            className={cn(
              'font-bold tracking-[-0.01em] text-white',
              variant === 'feature'
                ? 'text-[length:var(--font-size-heading-md)]'
                : 'text-[length:var(--font-size-heading-sm)]',
              '[text-shadow:0_1px_3px_rgb(0_0_0/0.4)]',
            )}
          >
            {title}
          </h3>
          {itemCount !== undefined && (
            <p className="text-[length:var(--text-sm)] font-medium text-white/80">
              {itemCount.toLocaleString()} item{itemCount === 1 ? '' : 's'}
            </p>
          )}
        </div>

        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            'bg-white/15 border border-white/25 text-white',
            'translate-x-1 opacity-0',
            'transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--motion-ease-out)]',
            'group-hover:translate-x-0 group-hover:opacity-100',
          )}
          aria-hidden="true"
        >
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </a>
  )
}

export { CategoryCard }
