'use client'

import React from 'react'

/**
 * StorefrontShellPromoBar — Optional promotional band above the header.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under StorefrontShell client root)
 * Props: Wrapper props + content slot.
 */
export interface StorefrontShellPromoBarProps extends React.HTMLAttributes<HTMLElement> {}

export function StorefrontShellPromoBar({
  className,
  children,
  ...props
}: StorefrontShellPromoBarProps) {
  if (!children) return null
  return (
    <section aria-label="Storefront promotions" className={className} {...props}>
      {children}
    </section>
  )
}

StorefrontShellPromoBar.displayName = 'StorefrontShell.PromoBar'

