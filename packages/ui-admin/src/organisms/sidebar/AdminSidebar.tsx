'use client'

import React from 'react'
import {
  LayoutGrid,
  ShoppingCart,
  Box,
  Users,
  BarChart3,
  Tag,
  Network,
  HelpCircle,
  Settings,
} from 'lucide-react'
import { cn } from '@ecom/ui'

import type { SidebarNavGroup, SidebarNavItem } from './types'

interface AdminSidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navGroups?: SidebarNavGroup[]
  footerNav?: SidebarNavItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
}

const DEFAULT_LOGO = (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-500)] shadow-sm">
      <LayoutGrid className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold tracking-tight text-foreground">EzMart</span>
  </div>
)

const FALLBACK_NAV: SidebarNavGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: <LayoutGrid className="w-5 h-5" />,
        href: '/dashboard',
        isActive: true,
      },
      { label: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, href: '/orders' },
      { label: 'Products', icon: <Box className="w-5 h-5" />, href: '/products' },
      { label: 'Customers', icon: <Users className="w-5 h-5" />, href: '/customers' },
      { label: 'Promotions', icon: <Tag className="w-5 h-5" />, href: '/promotions' },
      { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/analytics' },
    ],
  },
]

const FALLBACK_FOOTER: SidebarNavItem[] = [
  { label: 'Integrations', icon: <Network className="w-5 h-5" />, href: '/integrations' },
  { label: 'Help', icon: <HelpCircle className="w-5 h-5" />, href: '/help' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
]

function AdminSidebar({
  logo,
  navGroups,
  footerNav,
  currentPath,
  onNavigate,
  className,
  ...props
}: AdminSidebarProps) {
  const isCurrent = (href?: string) => href === currentPath

  // The active state needs an orange background with white text,
  // inactive uses gray text and hover states.
  const navItemClasses = (item: SidebarNavItem) => {
    const active = item.isActive || isCurrent(item.href)
    return cn(
      'group flex items-center gap-4 rounded-[var(--radius-md)] px-4 py-3 text-[15px] font-medium no-underline transition-all duration-[var(--motion-fast)]',
      active
        ? 'bg-[var(--brand-500)] text-white shadow-sm'
        : 'text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground',
    )
  }

  const iconClasses = (item: SidebarNavItem) =>
    cn(
      'shrink-0 transition-colors',
      item.isActive || isCurrent(item.href)
        ? 'text-white'
        : 'text-muted-foreground group-hover:text-foreground',
    )

  const renderNavItem = (item: SidebarNavItem, key: number | string) => (
    <li key={key}>
      <a
        href={item.href || '#'}
        onClick={(e) => {
          if (onNavigate && item.href) {
            e.preventDefault()
            onNavigate(item.href)
          }
          item.onClick?.()
        }}
        className={navItemClasses(item)}
      >
        {item.icon && <span className={iconClasses(item)}>{item.icon}</span>}
        <span className="flex-1 truncate tracking-wide">{item.label}</span>
      </a>
    </li>
  )

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-background border-r border-[#f1f1f1]',
        className,
      )}
      {...props}
    >
      {/* Brand logo area */}
      <div className="flex h-24 shrink-0 items-center px-8">{logo ?? DEFAULT_LOGO}</div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {(navGroups ?? FALLBACK_NAV).map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-4 pt-4 border-t border-[#f1f1f1]')}>
            {group.label && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <ul className="space-y-1.5">
              {group.items.map((item, ii) => renderNavItem(item, ii))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto px-4 pb-8 pt-4">
        <div className="border-t border-[#f1f1f1] pt-4">
          <ul className="space-y-1.5">
            {(footerNav ?? FALLBACK_FOOTER).map((item, ii) => renderNavItem(item, ii))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export { AdminSidebar }
export type { AdminSidebarProps }
