import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'


interface ProductCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProductCardContent({ className, children, ...props }: ProductCardContentProps) {
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