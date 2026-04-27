import { cn } from '@ecom/ui/utils'
import { ProductBadge } from '../../atoms/Badge/Badge'

interface ProductCardHighlightsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[]
  max?: number
}

export function ProductCardHighlights({
  items,
  max = 2,
  className,
  ...props
}: ProductCardHighlightsProps) {
  const highlights = items.slice(0, max)
  return (
    <div className={cn('mt-2 flex flex-wrap items-center gap-1.5', className)} {...props}>
      {highlights.map((item) => (
        <ProductBadge key={item} variant="secondary">
          {item}
        </ProductBadge>
      ))}
    </div>
  )
}
