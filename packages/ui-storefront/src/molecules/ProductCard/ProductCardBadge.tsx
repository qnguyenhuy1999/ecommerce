import { cn } from '@ecom/ui'

type ProductCardBadgeProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardBadge({ className, ...props }: ProductCardBadgeProps) {
  return (
    <div
      className={cn(
        'absolute left-3 top-3 z-10',
        'px-2.5 py-1 bg-foreground/90 text-background backdrop-blur-[2px]',
        'text-[length:var(--text-micro)] font-semibold rounded-full',
        'transition-transform duration-[var(--motion-fast)]',
        'group-hover:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}
