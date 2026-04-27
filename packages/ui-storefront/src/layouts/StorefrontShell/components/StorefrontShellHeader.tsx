'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

import { useStorefrontShellContext } from '../context/StorefrontShellContext'

/**
 * StorefrontShellHeader — Sticky header wrapper with optional scroll blur.
 *
 * Layer: Template section
 * RSC: No — requires 'use client'
 * Props: Wrapper props + header content slot.
 */
export interface StorefrontShellHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function StorefrontShellHeader({
  className,
  children,
  ...props
}: StorefrontShellHeaderProps) {
  const { stickyHeader, blurHeaderOnScroll, scrolled, headerRef } = useStorefrontShellContext()

  if (!children) return null

  return (
    <header
      ref={headerRef}
      aria-label="Storefront header"
      className={cn(
        'w-full',
        stickyHeader && 'sticky top-0 z-[var(--layer-sticky)]',
        stickyHeader && blurHeaderOnScroll
          ? cn(
              'transition-[background-color,box-shadow,backdrop-filter,border-color] duration-[var(--motion-normal)]',
              scrolled
                ? 'bg-[color-mix(in_srgb,var(--surface-base)_82%,transparent)] supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface-base)_65%,transparent)] backdrop-blur-md backdrop-saturate-150 border-b border-[var(--border-subtle)] shadow-[var(--elevation-card)]'
                : 'bg-[var(--surface-base)] border-b border-transparent',
            )
          : 'bg-[var(--surface-base)] border-b border-[var(--border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}

StorefrontShellHeader.displayName = 'StorefrontShell.Header'

