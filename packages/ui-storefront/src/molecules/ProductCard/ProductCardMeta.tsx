import { cn } from '@ecom/ui'

type ProductCardMetaProps = React.HTMLAttributes<HTMLDivElement>

export function ProductCardMeta({ className, ...props }: ProductCardMetaProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-micro)] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
