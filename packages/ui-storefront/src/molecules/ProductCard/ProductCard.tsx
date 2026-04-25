import React from 'react'

import { cn } from '@ecom/ui'

// ─── Compound Component Context ─────────────────────────────────────────────
const ProductCardContext = React.createContext<{
  id: string
  title: string
  href?: string
  view: 'grid' | 'list'
} | null>(null)

export function useProductCard() {
  const context = React.useContext(ProductCardContext)
  if (!context) {
    throw new Error('ProductCard components must be used within <ProductCard>')
  }
  return context
}

// ─── Root ProductCard ──────────────────────────────────────────────────────
export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  href?: string
  children: React.ReactNode
  /** Show loading skeleton overlay */
  loading?: boolean
  view?: 'grid' | 'list'
}

function ProductCard({
  id,
  title,
  href,
  className,
  loading,
  children,
  view = 'grid',
  ...props
}: ProductCardProps) {
  return (
    <ProductCardContext.Provider value={{ id, title, href, view }}>
      <article
        className={cn(
          'product-card group relative isolate flex h-full overflow-hidden',
          'border border-[var(--card-border)] bg-card text-card-foreground',
          'rounded-[var(--card-radius)]',
          'transition-[transform,box-shadow,border-color] duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'hover:-translate-y-0.5 hover:shadow-[var(--elevation-floating)] hover:border-[var(--border-default)]',
          'focus-within:outline-none focus-within:ring-[var(--focus-ring-width)] focus-within:ring-[var(--focus-ring-color)] focus-within:ring-offset-[var(--focus-ring-offset)] focus-within:ring-offset-background',
          view === 'list' ? 'flex-row items-stretch' : 'flex-col',
          loading && 'pointer-events-none',
          className,
        )}
        data-view={view}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 z-30 overflow-hidden rounded-[inherit] bg-card/80">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-[var(--surface-muted)] to-transparent" />
          </div>
        )}
        {children}
      </article>
    </ProductCardContext.Provider>
  )
}

// ─── Sub-components (for compound namespace) ───────────────────────────────
export { ProductCardImage } from './ProductCardImage'
export { ProductCardContent } from './ProductCardContent'
export { ProductCardTitle } from './ProductCardTitle'
export { ProductCardSubtitle } from './ProductCardSubtitle'
export { ProductCardBadge } from './ProductCardBadge'
export { ProductCardMeta } from './ProductCardMeta'
export { ProductCardRating } from './ProductCardRating'
export { ProductCardPrice } from './ProductCardPrice'
export { ProductCardActions } from './ProductCardActions'
export { ProductCardSwatches } from './ProductCardSwatches'
export { ProductCardHighlights } from './ProductCardHighlights'

export { ProductCard }
