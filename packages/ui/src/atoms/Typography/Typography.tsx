import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'typography-h1',
      h2: 'typography-h2',
      h3: 'typography-h3',
      h4: 'typography-h4',
      h5: 'typography-h5',
      p: 'typography-p',
      span: 'typography-span',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Component =
      as || (variant && variant !== 'span' ? variant : variant === 'span' ? 'span' : 'p')

    return (
      <Component ref={ref} className={cn(typographyVariants({ variant, className }))} {...props} />
    )
  },
)
Typography.displayName = 'Typography'

export { Typography, typographyVariants }
