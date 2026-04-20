import { cn } from '@ecom/ui'

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
        <span
          key={item}
          className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[length:var(--text-micro)] font-medium text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  )
}
