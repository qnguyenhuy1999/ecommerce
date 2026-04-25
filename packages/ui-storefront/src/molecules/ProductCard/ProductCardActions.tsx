import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

interface ProductCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * On `grid` view, when true the actions row stays hidden on `lg+` screens
   * and only fades in on card hover/focus. Mobile/tablet always show actions.
   */
  hoverReveal?: boolean
}

export function ProductCardActions({
  className,
  children,
  hoverReveal = false,
  ...props
}: ProductCardActionsProps) {
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
        hoverReveal && [
          'lg:opacity-0 lg:translate-y-1',
          'lg:transition-[opacity,transform] lg:duration-[var(--motion-fast)] lg:ease-[var(--motion-ease-out)]',
          'group-hover:lg:opacity-100 group-hover:lg:translate-y-0',
          'group-focus-within:lg:opacity-100 group-focus-within:lg:translate-y-0',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
