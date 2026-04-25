'use client'

import React from 'react'

import { cn } from '../../lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[var(--space-20)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)]',
          'px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-foreground leading-[var(--line-height-relaxed)]',
          'transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
          'placeholder:text-[var(--input-placeholder)]',
          'focus-visible:outline-none focus-visible:border-[var(--brand-500)] focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-disabled)]',
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
