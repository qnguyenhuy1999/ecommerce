import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function ProductCardTitle({ className, ...props }: ProductCardTitleProps) {
  const { title, view } = useProductCard()
  return (
    <h3
      className={cn(
        'font-semibold text-foreground tracking-[-0.01em]',
        view === 'list'
          ? 'text-[var(--font-size-heading-sm)] line-clamp-2 leading-tight'
          : 'text-[var(--text-base)] line-clamp-2 leading-snug',
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
