'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      [
        'text-sm',
        'font-[var(--font-weight-medium)]',
        'leading-none',
        'text-[var(--text-primary)]',
        'transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-out)]',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-[var(--opacity-40)]',
      ].join(' '),
      className,
    )}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }
