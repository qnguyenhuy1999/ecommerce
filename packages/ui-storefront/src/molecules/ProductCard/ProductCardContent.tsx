import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardContentProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardContent({ className, children, ...props }: ProductCardContentProps) {
  const { href, view } = useProductCard()

  const classes = cn(
    'flex flex-1 flex-col justify-between gap-2 p-[var(--padding-card-content)]',
    view === 'list' ? 'min-h-[14rem] py-5 sm:px-5 sm:py-5' : 'min-h-[11rem] pb-14',
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes}>
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
