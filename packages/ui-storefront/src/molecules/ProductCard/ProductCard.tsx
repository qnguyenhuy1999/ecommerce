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
          'product-card group relative flex h-full overflow-hidden border border-border/70 bg-card text-card-foreground',
          'rounded-[var(--radius-xl)] shadow-[var(--elevation-card)]',
          'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'hover:-translate-y-0.5 hover:shadow-[var(--elevation-hover)] hover:border-border',
          'focus-within:ring-2 focus-within:ring-brand/25 focus-within:ring-offset-2 focus-within:ring-offset-background',
          view === 'list' ? 'flex-row items-stretch' : 'flex-col',
          loading && 'pointer-events-none',
          className,
        )}
        data-view={view}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 z-10 overflow-hidden rounded-[var(--radius-xl)] bg-card/76 backdrop-blur-[2px]">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-muted/70 to-transparent" />
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
