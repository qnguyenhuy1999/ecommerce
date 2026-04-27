import { cn } from '@ecom/ui'

export interface CartPageLayoutSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CartPageLayoutSidebar({
  children,
  className,
  ...props
}: CartPageLayoutSectionProps) {
  return (
    <aside
      className={cn('space-y-4 lg:sticky lg:top-6', className)}
      aria-label="Cart summary and checkout"
      {...props}
    >
      {children}
    </aside>
  )
}
