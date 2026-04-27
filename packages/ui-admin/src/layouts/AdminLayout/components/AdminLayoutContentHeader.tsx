'use client'

import React from 'react'

/**
 * AdminLayoutContentHeader — Optional content header within the main container.
 *
 * Layer: Template section
 * RSC: No — requires 'use client' (composed under AdminLayout client root)
 * Props: Wrapper props + content slot.
 */
export interface AdminLayoutContentHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminLayoutContentHeader({ children, ...props }: AdminLayoutContentHeaderProps) {
  if (!children) return null
  return (
    <div aria-label="Admin content header" {...props}>
      {children}
    </div>
  )
}

AdminLayoutContentHeader.displayName = 'AdminLayout.ContentHeader'

