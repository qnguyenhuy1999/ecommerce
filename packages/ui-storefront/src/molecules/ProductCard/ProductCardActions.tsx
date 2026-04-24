import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardActionsProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardActions({ className, children, ...props }: ProductCardActionsProps) {
  const { view } = useProductCard()

  if (view === 'list') {
    return (
      <div
        className={cn(
          'mt-5 flex items-center justify-start gap-2 border-t border-border/60 pt-4',
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
