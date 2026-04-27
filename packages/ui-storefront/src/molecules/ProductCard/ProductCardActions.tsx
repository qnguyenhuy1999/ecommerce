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
          'mt-4 flex items-center justify-start gap-3',
          'border-t border-[var(--border-subtle)] pt-4',
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
        'flex items-center gap-2',
        'px-4 sm:px-5 pb-4 sm:pb-5',
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
