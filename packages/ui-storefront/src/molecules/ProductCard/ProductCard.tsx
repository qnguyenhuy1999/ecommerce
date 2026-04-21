import React from 'react'

import { cn } from '@ecom/ui'

// ─── Compound Component Context ─────────────────────────────────────────────
const ProductCardContext = React.createContext<{
  id: string
  title: string
  href?: string
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
}

function ProductCard({
  id,
  title,
  href,
  className,
  loading,
  children,
  ...props
}: ProductCardProps) {
  return (
    <ProductCardContext.Provider value={{ id, title, href }}>
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden border border-border/70 bg-card',
          'rounded-[var(--radius-lg)] shadow-[var(--elevation-card)]',
          'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'hover:-translate-y-0.5 hover:shadow-[var(--elevation-hover)] hover:border-border',
          'focus-within:ring-2 focus-within:ring-brand/30 focus-within:ring-offset-2 focus-within:ring-offset-background',
          loading && 'pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 z-10 overflow-hidden rounded-[var(--radius-lg)] bg-card/70 backdrop-blur-[1px]">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-muted/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
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
