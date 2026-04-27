'use client'

import React from 'react'

/**
 * AdminLayoutTopbar — Optional top band above the primary header.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under AdminLayout client root)
 * Props: Wrapper props + content slot.
 */
export interface AdminLayoutTopbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminLayoutTopbar({ children, ...props }: AdminLayoutTopbarProps) {
  if (!children) return null
  return (
    <div aria-label="Admin topbar" {...props}>
      {children}
    </div>
  )
}

AdminLayoutTopbar.displayName = 'AdminLayout.Topbar'

