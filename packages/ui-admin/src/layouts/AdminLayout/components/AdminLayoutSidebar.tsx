'use client'

import React from 'react'

import { AdminSidebar } from '../../../organisms/Sidebar/AdminSidebar'
import { useAdminLayoutContext } from '../context/AdminLayoutContext'

/**
 * AdminLayoutSidebar — Sidebar zone that wires collapse state into AdminSidebar.
 *
 * Layer: Template section
 * RSC: No — requires 'use client'
 * Props: Either render `children` directly or configure the default `AdminSidebar`.
 */
export interface AdminLayoutSidebarProps
  extends Omit<React.ComponentProps<typeof AdminSidebar>, 'collapsed' | 'onToggleCollapse'> {
  children?: React.ReactNode
}

export function AdminLayoutSidebar({ children, ...props }: AdminLayoutSidebarProps) {
  const { isSidebarCollapsed, toggleSidebar } = useAdminLayoutContext()

  if (children) return <>{children}</>

  return (
    <AdminSidebar
      aria-label="Admin sidebar"
      collapsed={isSidebarCollapsed}
      onToggleCollapse={toggleSidebar}
      {...props}
    />
  )
}

AdminLayoutSidebar.displayName = 'AdminLayout.Sidebar'

