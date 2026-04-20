import { cn } from '@ecom/ui'

interface ProductCardSwatchesProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[]
  max?: number
}

export function ProductCardSwatches({
  colors,
  max = 3,
  className,
  ...props
}: ProductCardSwatchesProps) {
  const displayColors = colors.slice(0, max)
  const remaining = colors.length - max

  return (
    <div className={cn('mt-1 flex items-center gap-1.5', className)} {...props}>
      {displayColors.map((color, i) => (
        <div
          key={i}
          className="h-4 w-4 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color as string }}
        />
      ))}
      {remaining > 0 && (
        <span className="ml-1 text-[length:var(--text-micro)] text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  )
}
