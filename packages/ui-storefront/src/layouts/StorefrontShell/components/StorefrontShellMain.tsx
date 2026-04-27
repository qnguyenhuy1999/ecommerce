'use client'

import React from 'react'

/**
 * StorefrontShellMain — Primary page content region.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under StorefrontShell client root)
 * Props: Wrapper props + page content slot.
 */
export interface StorefrontShellMainProps extends React.HTMLAttributes<HTMLElement> {}

export function StorefrontShellMain({ className, children, ...props }: StorefrontShellMainProps) {
  return (
    <main aria-label="Storefront content" className={className} {...props}>
      {children}
    </main>
  )
}

StorefrontShellMain.displayName = 'StorefrontShell.Main'

