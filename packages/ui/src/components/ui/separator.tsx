'use client'

import React from 'react'

import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '../../lib/utils'

const thicknessMap = {
  sm: 'h-px',
  default: 'h-[var(--space-0-5)]',
  lg: 'h-0.5',
}

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  size?: 'sm' | 'default' | 'lg'
}

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & { size?: 'sm' | 'default' | 'lg' }
>(({ size = 'default', className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      thicknessMap[size],
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      className,
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
