'use client'

import React from 'react'

const ProductCardContext = React.createContext<{
  id: string
  title: string
  href?: string
} | null>(null)

export function useProductCard() {
  const context = React.useContext(ProductCardContext)
  if (!context) {
    throw new Error('ProductCard components must be used within ProductCard')
  }
  return context
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  href?: string
  children: React.ReactNode
}

function ProductCard({ id, title, href, className, children, ...props }: ProductCardProps) {
  return (
    <ProductCardContext.Provider value={{ id, title, href }}>
      <div
        className={`group flex flex-col h-full bg-card rounded-[var(--radius-lg)] shadow-[var(--elevation-card)] transition-[box-shadow] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-default)] hover:shadow-[var(--elevation-hover)] ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    </ProductCardContext.Provider>
  )
}

function ProductCardImage({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { title, href } = useProductCard()
  const [loaded, setLoaded] = React.useState(false)

  const imageContent = (
    <div
      className={`relative aspect-[16/10] bg-muted overflow-hidden rounded-t-[var(--radius-lg)] ${className || ''}`}
    >
      <img
        src={src || '/placeholder.jpg'}
        alt={alt || title}
        loading="lazy"
        onLoad={() => {
          setLoaded(true)
        }}
        className={`w-full h-full object-cover transition-opacity duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-default)] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block relative">
        {imageContent}
      </a>
    )
  }
  return <div className="block relative">{imageContent}</div>
}

function ProductCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { href } = useProductCard()
  if (href) {
    return (
      <a href={href} className={`flex flex-col flex-1 p-4 ${className || ''}`}>
        {children}
      </a>
    )
  }
  return (
    <div className={`flex flex-col flex-1 p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

function ProductCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { title } = useProductCard()
  return (
    <h3
      className={`font-medium tracking-tight text-foreground line-clamp-2 hover:underline underline-offset-4 ${className || ''}`}
      {...props}
    >
      {title}
    </h3>
  )
}

function ProductCardBadge({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`absolute top-3 left-3 z-10 px-2 py-1 bg-foreground text-background text-[11px] font-bold rounded-[var(--radius-sm)] ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { ProductCard, ProductCardImage, ProductCardContent, ProductCardTitle, ProductCardBadge }
