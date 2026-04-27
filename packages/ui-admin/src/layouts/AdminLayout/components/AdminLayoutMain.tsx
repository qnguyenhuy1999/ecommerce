'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

/**
 * AdminLayoutMain — Primary content region for AdminLayout.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under AdminLayout client root)
 * Props: Wrapper props + page content slot.
 */
export interface AdminLayoutMainProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string
}

export function AdminLayoutMain({
  children,
  className,
  containerClassName,
  ...props
}: AdminLayoutMainProps) {
  return (
    <main aria-label="Admin content" className={cn('relative flex-1', className)} {...props}>
      <div
        className={cn(
          'mx-auto flex w-full max-w-[var(--admin-content-max-width)] flex-1 flex-col',
          'gap-6',
          'px-4 sm:px-6 lg:px-8',
          'pt-6 pb-10',
          'animate-in fade-in slide-in-from-bottom-2 duration-[var(--duration-normal)] fill-mode-both',
          containerClassName,
        )}
      >
        {children}
      </div>
    </main>
  )
}

AdminLayoutMain.displayName = 'AdminLayout.Main'
