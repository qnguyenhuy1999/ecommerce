'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both'
  maxHeight?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', maxHeight, className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
          orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          orientation === 'both' && 'overflow-auto',
          // Custom thin scrollbar
          '[&::-webkit-scrollbar]:w-1.5',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border',
          'hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30',
          // Firefox
          'scrollbar-width-thin scrollbar-color-[var(--color-border)_transparent]',
          className,
        )}
        style={{ maxHeight, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
export type { ScrollAreaProps }
