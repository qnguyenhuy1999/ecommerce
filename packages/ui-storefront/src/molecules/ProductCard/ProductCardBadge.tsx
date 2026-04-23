import { cn } from '@ecom/ui'

type ProductCardBadgeProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardBadge({ className, ...props }: ProductCardBadgeProps) {
  return (
    <div
      className={cn(
        'absolute left-3 top-3 z-10 pointer-events-none',
        'transition-transform duration-[var(--motion-fast)]',
        'group-hover:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}
