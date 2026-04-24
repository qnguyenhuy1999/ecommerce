'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[var(--space-16)] w-full rounded-[var(--input-radius)] border border-input bg-[var(--surface-base)]/92 px-3 py-2',
          'text-sm text-foreground leading-relaxed',
          'shadow-[var(--elevation-xs)] backdrop-blur-[6px]',
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[var(--elevation-card)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
