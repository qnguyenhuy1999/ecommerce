import type React from 'react'

import { cn } from '@ecom/ui/utils'

export interface CartPageLayoutSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CartPageLayoutItems({ children, className, ...props }: CartPageLayoutSectionProps) {
  return (
    <section className={cn('space-y-4', className)} aria-label="Cart items" {...props}>
      {children}
    </section>
  )
}
