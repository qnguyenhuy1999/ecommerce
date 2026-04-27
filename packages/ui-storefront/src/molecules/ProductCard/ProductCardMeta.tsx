import { cn } from '@ecom/ui/utils'

type ProductCardMetaProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardMeta({ className, ...props }: ProductCardMetaProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1',
        'text-[length:var(--text-xs)] text-[var(--text-tertiary)]',
        className,
      )}
      {...props}
    />
  )
}
