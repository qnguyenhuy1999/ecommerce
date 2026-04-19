'use client'

import { forwardRef } from 'react'
import type { CSSProperties, HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both'
  maxHeight?: string
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', maxHeight, className, children, style, ...props }, ref) => {
    const mergedStyle: CSSProperties & { '--scroll-area-max-height'?: string } = {
      ...(style ?? {}),
      ...(maxHeight ? { '--scroll-area-max-height': maxHeight } : {}),
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
          orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          orientation === 'both' && 'overflow-auto',
          '[&::-webkit-scrollbar]:w-1.5',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::webkit-scrollbar-thumb]:bg-border',
          'hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30',
          'scrollbar-width-thin scrollbar-color-[var(--color-border)_transparent]',
          maxHeight && 'max-[var(--scroll-area-max-height)]',
          className,
        )}
        style={mergedStyle}
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
