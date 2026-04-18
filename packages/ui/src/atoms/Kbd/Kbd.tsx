'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Display keys in a combo, e.g. ['⌘', 'K'] */
  keys?: string[]
}
              
function Kbd({ keys, children, className, ...props }: KbdProps) {
  if (keys && keys.length > 0) {
    return (
      <span className={cn('inline-flex items-center gap-0.5', className)} {...props}>
        {keys.map((key, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="text-muted-foreground/50 text-[var(--text-micro)] mx-px select-none">+</span>
            )}
            <kbd
              className={cn(
                'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5',
                'rounded-[var(--radius-xs)] border border-border/80 bg-muted/60',
                'text-[var(--text-micro)] font-medium text-muted-foreground font-mono leading-none',
                'shadow-[0_1px_0_1px_var(--color-border)] select-none',
              )}
            >
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </span>
    )
  }

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5',
        'rounded-[var(--radius-xs)] border border-border/80 bg-muted/60',
        'text-[var(--text-micro)] font-medium text-muted-foreground font-mono leading-none',
        'shadow-[0_1px_0_1px_var(--color-border)] select-none',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

export { Kbd }
