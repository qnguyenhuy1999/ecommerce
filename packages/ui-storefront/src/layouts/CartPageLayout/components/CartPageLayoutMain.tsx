import { cn } from '@ecom/ui'

export interface CartPageLayoutSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CartPageLayoutMain({ children, className, ...props }: CartPageLayoutSectionProps) {
  return (
    <section className={cn('space-y-4', className)} aria-label="Cart details" {...props}>
      {children}
    </section>
  )
}
