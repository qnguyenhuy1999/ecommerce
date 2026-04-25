import { cn } from '@ecom/ui'

type ProductCardBadgeProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardBadge({ className, ...props }: ProductCardBadgeProps) {
  return (
    <div
      className={cn(
        'absolute left-[var(--space-3)] top-[var(--space-3)] z-10 pointer-events-none',
        'flex items-center gap-[var(--space-1)]',
        className,
      )}
      {...props}
    />
  )
}
