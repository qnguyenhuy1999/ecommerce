import { cn } from '@ecom/ui/utils'

import { useProductCard } from './ProductCard'

type ProductCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function ProductCardTitle({ className, ...props }: ProductCardTitleProps) {
  const { title, view } = useProductCard()
  return (
    <h3
      className={cn(
        'font-semibold tracking-[-0.005em] line-clamp-2',
        'text-[var(--text-primary)]',
        view === 'list'
          ? 'text-[length:var(--font-size-heading-sm)] leading-[var(--line-height-snug)]'
          : 'text-sm sm:text-[length:var(--text-base)] leading-[var(--line-height-snug)]',
        'transition-colors duration-[var(--motion-fast)]',
        'group-hover:text-[var(--text-link)]',
        className,
      )}
      {...props}
    >
      {title}
    </h3>
  )
}
