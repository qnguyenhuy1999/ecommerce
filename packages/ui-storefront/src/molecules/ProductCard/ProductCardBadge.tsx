import { cn } from '@ecom/ui'

type ProductCardBadgeProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardBadge({ className, ...props }: ProductCardBadgeProps) {
  return (
    <div
      className={cn(
        'absolute left-3 top-3 z-10 pointer-events-none',
        'flex items-center gap-1',
        className,
      )}
      {...props}
    />
  )
}
