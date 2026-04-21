import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function ProductCardTitle({ className, ...props }: ProductCardTitleProps) {
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
