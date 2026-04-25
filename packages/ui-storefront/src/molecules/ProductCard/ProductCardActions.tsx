import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardActionsProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardActions({ className, children, ...props }: ProductCardActionsProps) {
  const { view } = useProductCard()

  if (view === 'list') {
    return (
      <div
        className={cn(
          'mt-[var(--space-4)] flex items-center justify-start gap-[var(--space-3)]',
          'border-t border-[var(--border-subtle)] pt-[var(--space-4)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-[var(--space-2)]',
        'px-[var(--space-4)] sm:px-[var(--space-5)] pb-[var(--space-4)] sm:pb-[var(--space-5)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
