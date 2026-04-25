import { cn } from '@ecom/ui'

import { useProductCard } from './ProductCard'

type ProductCardMetaProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardMeta({ className, ...props }: ProductCardMetaProps) {
  const { view } = useProductCard()
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground',
        view === 'list' ? 'text-[var(--text-xs)]' : 'text-[length:var(--text-micro)]',
        className,
      )}
      {...props}
    />
  )
}
