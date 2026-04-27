'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

/**
 * StorefrontShellFooter — Page footer wrapper.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under StorefrontShell client root)
 * Props: Wrapper props + footer content slot.
 */
export interface StorefrontShellFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function StorefrontShellFooter({
  className,
  children,
  ...props
}: StorefrontShellFooterProps) {
  if (!children) return null

  return (
    <footer
      aria-label="Storefront footer"
      className={cn('border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)]', className)}
      {...props}
    >
      {children}
    </footer>
  )
}

StorefrontShellFooter.displayName = 'StorefrontShell.Footer'

