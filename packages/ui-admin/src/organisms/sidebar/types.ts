import type * as React from 'react'

export interface SidebarNavItem {
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: string | number
  onClick?: () => void
  isActive?: boolean
  children?: { label: string; href: string; isActive?: boolean }[]
}

export interface SidebarNavGroup {
  label?: string
  items: SidebarNavItem[]
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navGroups?: SidebarNavGroup[]
  footer?: React.ReactNode
  collapsed?: boolean
  variant?: 'fixed' | 'embedded'
  onNavigate?: (href: string) => void
  currentPath?: string
}
