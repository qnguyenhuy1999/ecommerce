import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardContentProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardContent({ className, children, ...props }: ProductCardContentProps) {
  const { href, view } = useProductCard()

  const classes = cn(
    'flex flex-1 flex-col justify-between gap-[var(--space-3)]',
    view === 'list'
      ? 'p-[var(--space-5)] sm:p-[var(--space-6)]'
      : 'p-[var(--space-4)] sm:p-[var(--space-5)]',
    className,
  )

  if (href) {
    return (
      <a href={href} className={cn(classes, 'no-underline focus-visible:outline-none')}>
        {children}
      </a>
    )
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
