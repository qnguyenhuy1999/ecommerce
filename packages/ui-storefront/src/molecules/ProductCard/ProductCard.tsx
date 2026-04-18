'use client'

import React from 'react'

import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/Rating/Rating'

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
          'group relative flex flex-col h-full bg-card',
          'rounded-[var(--radius-lg)] shadow-[var(--elevation-card)]',
          // Shadow-only transition — no scale to avoid layout shift
          'transition-shadow duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'hover:shadow-[var(--elevation-hover)]',
          loading && 'pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 rounded-[var(--radius-lg)]">
            <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        )}
        {children}
      </article>
    </ProductCardContext.Provider>
  )
}

// ─── Image ───────────────────────────────────────────────────────────────────
type ProductCardImageProps = React.ImgHTMLAttributes<HTMLImageElement>

function ProductCardImage({ src, alt, className, ...props }: ProductCardImageProps) {
  const { title, href } = useProductCard()
  const [loaded, setLoaded] = React.useState(false)

  const imageContainer = (
    <div className="relative aspect-[16/10] bg-muted overflow-hidden rounded-t-[var(--radius-lg)]">
      <img
        src={src || '/placeholder.jpg'}
        alt={alt || title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'w-full h-full object-cover',
          // Fade-in on load with compositor-friendly transition
          'transition-opacity duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]',
          'will-change-opacity',
          loaded ? 'opacity-100' : 'opacity-0',
          // Subtle zoom on card hover
          'group-hover:scale-[1.02] transition-transform duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
          className,
        )}
        {...props}
      />
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

// ─── Content wrapper ─────────────────────────────────────────────────────────
type ProductCardContentProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardContent({ className, children, ...props }: ProductCardContentProps) {
  const { href } = useProductCard()
  if (href) {
    return (
      <a
        href={href}
        className={cn('flex flex-col flex-1 p-[var(--padding-card-content)]', className)}
      >
        {children}
      </a>
    )
  }
  return (
    <div
      className={cn('flex flex-col flex-1 p-[var(--padding-card-content)]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Title ───────────────────────────────────────────────────────────────────
type ProductCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

function ProductCardTitle({ className, ...props }: ProductCardTitleProps) {
  const { title } = useProductCard()
  return (
    <h3
      className={cn(
        'font-medium text-[var(--text-sm)] text-foreground line-clamp-2 leading-tight',
        'transition-colors duration-[var(--motion-fast)]',
        className,
      )}
      {...props}
    >
      {title}
    </h3>
  )
}

// ─── Badge overlay ───────────────────────────────────────────────────────────
type ProductCardBadgeProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardBadge({ className, ...props }: ProductCardBadgeProps) {
  return (
    <div
      className={cn(
        'absolute top-3 left-3 z-10',
        'px-2 py-1 bg-foreground text-background',
        'text-[var(--text-micro)] font-bold rounded-[var(--radius-sm)]',
        'transition-transform duration-[var(--motion-fast)]',
        className,
      )}
      {...props}
    />
  )
}

// ─── Meta row (sold count, stock, etc.) ──────────────────────────────────────
type ProductCardMetaProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardMeta({ className, ...props }: ProductCardMetaProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-[var(--text-micro)] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

// ─── Rating integration ──────────────────────────────────────────────────────
interface ProductCardRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  count?: number
}

function ProductCardRating({ value, count, className, ...props }: ProductCardRatingProps) {
  return (
    <Rating
      value={value}
      size="sm"
      showCount
      count={count}
      className={cn('mt-1.5', className)}
      {...props}
    />
  )
}

// ─── Price ───────────────────────────────────────────────────────────────────
interface ProductCardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number
  originalPrice?: number
  currency?: string
}

function ProductCardPrice({
  price,
  originalPrice,
  currency = '$',
  className,
  ...props
}: ProductCardPriceProps) {
  const isDiscounted = originalPrice && originalPrice > price

  return (
    <div className={cn('flex items-baseline gap-2 mt-auto pt-3', className)} {...props}>
      <span
        className={cn(
          'font-semibold text-lg',
          isDiscounted ? 'text-brand' : 'text-foreground'
        )}
      >
        {currency}
        {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {isDiscounted && (
        <span className="text-[var(--text-sm)] text-muted-foreground line-through opacity-70 font-medium">
          {currency}
          {originalPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
    </div>
  )
}

// ─── Actions (Quick Add / Wishlist) ──────────────────────────────────────────
type ProductCardActionsProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardActions({ className, children, ...props }: ProductCardActionsProps) {
  return (
    <div
      className={cn(
        'absolute top-3 right-3 z-20 flex flex-col gap-2',
        'opacity-0 translate-x-2 transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
        'group-hover:opacity-100 group-hover:translate-x-0',
        'focus-within:opacity-100 focus-within:translate-x-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Swatches ────────────────────────────────────────────────────────────────
interface ProductCardSwatchesProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[]
  max?: number
}

function ProductCardSwatches({ colors, max = 3, className, ...props }: ProductCardSwatchesProps) {
  const displayColors = colors.slice(0, max)
  const remaining = colors.length - max

  return (
    <div className={cn('flex items-center gap-1.5 mt-2', className)} {...props}>
      {displayColors.map((color, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
      ))}
      {remaining > 0 && (
        <span className="text-[var(--text-micro)] text-muted-foreground ml-1">
          +{remaining}
        </span>
      )}
    </div>
  )
}
// ─── Exported sub-components ─────────────────────────────────────────────────
export {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
  ProductCardMeta,
  ProductCardRating,
  ProductCardPrice,
  ProductCardActions,
  ProductCardSwatches,
}
