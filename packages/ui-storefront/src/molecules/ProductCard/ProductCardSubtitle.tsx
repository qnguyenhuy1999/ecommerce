import { cn } from '@ecom/ui'

type ProductCardSubtitleProps = React.HTMLAttributes<HTMLParagraphElement>

export function ProductCardSubtitle({ className, ...props }: ProductCardSubtitleProps) {
  return (
    <p
      className={cn(
        'text-[var(--text-xs)] uppercase tracking-[0.08em] font-medium text-muted-foreground/90',
        className,
      )}
      {...props}
    />
  )
}
