import { cn } from '@ecom/ui'

type ProductCardMetaProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardMeta({ className, ...props }: ProductCardMetaProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-[var(--space-2)] gap-y-[var(--space-1)]',
        'text-[length:var(--text-xs)] text-[var(--text-tertiary)]',
        className,
      )}
      {...props}
    />
  )
}
