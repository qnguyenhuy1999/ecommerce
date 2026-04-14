'use client'

import React from 'react'

import { ChevronRight } from 'lucide-react'

import { cn, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@ecom/ui'

import type { SidebarProps, SidebarNavGroup, SidebarNavItem } from './types'

function NavItem({ item, collapsed }: { item: SidebarNavItem; collapsed?: boolean }) {
  const [expanded, setExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isCurrent = typeof window !== 'undefined' && window.location.pathname === item.href // naïve check

  const content = (
    <a
      href={item.href || '#'}
      onClick={(e) => {
        if (hasChildren) {
          e.preventDefault()
          setExpanded((prev) => !prev)
        }
        item.onClick?.()
      }}
      className={cn(
        'admin-sidebar__nav-item',
        isCurrent && 'admin-sidebar__nav-item--active',
        collapsed ? 'justify-center px-0' : '',
      )}
    >
      {item.icon && <span className={cn('shrink-0', collapsed ? '' : '')}>{item.icon}</span>}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full bg-brand text-brand-foreground">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span
              className="shrink-0 transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
            >
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </>
      )}
    </a>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <li>{content}</li>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <li>
      {content}
      {hasChildren && expanded && !collapsed && (
        <ul className="mt-1 pl-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {item.children!.map((child, idx) => (
            <li key={idx}>
              <a
                href={child.href}
                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function Sidebar({
  logo,
  navGroups = [],
  footer,
  collapsed = false,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn('admin-sidebar', collapsed && 'admin-sidebar--collapsed', className)}
      {...props}
    >
      {logo && (
        <div
          className={cn(
            'h-14 flex items-center border-b shrink-0',
            collapsed ? 'justify-center px-0' : 'px-4',
          )}
        >
          {logo}
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && !collapsed && (
              <p className="px-2 mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            {group.label && collapsed && (
              <div className="h-4" /> // Spacing for collapsed groups
            )}
            <ul className="space-y-1">
              {group.items.map((item, i) => (
                <NavItem key={i} item={item} collapsed={collapsed} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer && (
        <div
          className={cn(
            'p-3 border-t shrink-0 flex items-center',
            collapsed ? 'justify-center' : '',
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  )
}

export { Sidebar }
export type { SidebarProps, SidebarNavGroup, SidebarNavItem }
