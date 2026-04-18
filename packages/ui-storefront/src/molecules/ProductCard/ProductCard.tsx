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

// ─── Image ───────────────────────────────────────────────────────────────────
type ProductCardImageProps = React.ImgHTMLAttributes<HTMLImageElement>

function ProductCardImage({ src, alt, className, ...props }: ProductCardImageProps) {
  const { title, href } = useProductCard()
  const [loaded, setLoaded] = React.useState(false)

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

// ─── Content wrapper ─────────────────────────────────────────────────────────
type ProductCardContentProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardContent({ className, children, ...props }: ProductCardContentProps) {
  const { href } = useProductCard()
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'flex min-h-[170px] flex-1 flex-col gap-2 p-[var(--padding-card-content)]',
          className,
        )}
      >
        {children}
      </a>
    )
  }
  return (
    <div
      className={cn(
        'flex min-h-[170px] flex-1 flex-col gap-2 p-[var(--padding-card-content)]',
        className,
      )}
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
        'font-semibold text-[var(--text-base)] text-foreground line-clamp-2 leading-snug',
        'transition-colors duration-[var(--motion-fast)]',
        'group-hover:text-foreground',
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
        'absolute left-3 top-3 z-10',
        'px-2.5 py-1 bg-foreground/90 text-background backdrop-blur-[2px]',
        'text-[var(--text-micro)] font-semibold rounded-full',
        'transition-transform duration-[var(--motion-fast)]',
        'group-hover:-translate-y-0.5',
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
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--text-micro)] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

type ProductCardSubtitleProps = React.HTMLAttributes<HTMLParagraphElement>

function ProductCardSubtitle({ className, ...props }: ProductCardSubtitleProps) {
  return (
    <p
      className={cn(
        'text-[var(--text-xs)] uppercase tracking-[0.08em] font-medium text-muted-foreground/90',
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
  currencyCode?: string
  locale?: string
}

function ProductCardPrice({
  price,
  originalPrice,
  currency = '$',
  currencyCode,
  locale,
  className,
  ...props
}: ProductCardPriceProps) {
  const isDiscounted = originalPrice && originalPrice > price
  const effectiveCurrencyCode = currencyCode || (/^[A-Z]{3}$/.test(currency) ? currency : undefined)

  const formatMoney = React.useCallback(
    (value: number) => {
      if (effectiveCurrencyCode) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: effectiveCurrencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)
      }

      return `${currency}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    },
    [currency, effectiveCurrencyCode, locale],
  )

  const discountPercent =
    isDiscounted && originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={cn('mt-auto space-y-1.5 pt-3', className)} {...props}>
      <div className="flex items-center gap-2">
        <span
          className={cn('font-semibold text-xl', isDiscounted ? 'text-brand' : 'text-foreground')}
        >
          {formatMoney(price)}
        </span>
        {isDiscounted && originalPrice && (
          <span className="text-[var(--text-sm)] text-muted-foreground line-through opacity-80 font-medium">
            {formatMoney(originalPrice)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            -{discountPercent}%
          </span>
        )}
      </div>
      <p className="text-[var(--text-micro)] text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  )
}

// ─── Actions (Quick Add / Wishlist) ──────────────────────────────────────────
type ProductCardActionsProps = React.HTMLAttributes<HTMLDivElement>

function ProductCardActions({ className, children, ...props }: ProductCardActionsProps) {
  return (
    <div
      className={cn(
        'absolute bottom-3 left-3 right-3 z-20 flex items-center justify-end gap-2',
        'opacity-100 translate-y-0',
        'md:opacity-0 md:translate-y-2 md:transition-all md:duration-[var(--motion-normal)] md:ease-[var(--motion-ease-out)]',
        'md:group-hover:opacity-100 md:group-hover:translate-y-0',
        'md:focus-within:opacity-100 md:focus-within:translate-y-0',
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
    <div className={cn('mt-1 flex items-center gap-1.5', className)} {...props}>
      {displayColors.map((color, i) => (
        <div
          key={i}
          className="h-4 w-4 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
      ))}
      {remaining > 0 && (
        <span className="ml-1 text-[var(--text-micro)] text-muted-foreground">+{remaining}</span>
      )}
    </div>
  )
}

interface ProductCardHighlightsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[]
  max?: number
}

function ProductCardHighlights({
  items,
  max = 2,
  className,
  ...props
}: ProductCardHighlightsProps) {
  const highlights = items.slice(0, max)
  return (
    <div className={cn('mt-2 flex flex-wrap items-center gap-1.5', className)} {...props}>
      {highlights.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  )
}
// ─── Exported sub-components ─────────────────────────────────────────────────
export {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardSubtitle,
  ProductCardBadge,
  ProductCardMeta,
  ProductCardRating,
  ProductCardPrice,
  ProductCardActions,
  ProductCardSwatches,
  ProductCardHighlights,
}
