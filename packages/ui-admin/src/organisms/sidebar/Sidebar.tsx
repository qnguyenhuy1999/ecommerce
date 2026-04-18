'use client'

import React from 'react'

import { ChevronRight } from 'lucide-react'

import { cn, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@ecom/ui'

import type { SidebarProps, SidebarNavGroup, SidebarNavItem } from './types'

function NavItem({
  item,
  collapsed,
  onNavigate,
  currentPath,
}: {
  item: SidebarNavItem
  collapsed?: boolean
  onNavigate?: (href: string) => void
  currentPath?: string
}) {
  const [expanded, setExpanded] = React.useState(
    item.children?.some((c) => c.isActive || (currentPath && c.href === currentPath)) ?? false,
  )
  const hasChildren = item.children && item.children.length > 0
  const isCurrent =
    item.isActive ||
    (currentPath && item.href === currentPath) ||
    (typeof window !== 'undefined' && window.location.pathname === item.href)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = e.currentTarget.parentElement?.nextElementSibling?.querySelector(
        'a',
      ) as HTMLAnchorElement
      if (next) next.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = e.currentTarget.parentElement?.previousElementSibling?.querySelector(
        'a',
      ) as HTMLAnchorElement
      if (prev) prev.focus()
    } else if (e.key === 'ArrowRight' && hasChildren && !expanded) {
      e.preventDefault()
      setExpanded(true)
    } else if (e.key === 'ArrowLeft' && hasChildren && expanded) {
      e.preventDefault()
      setExpanded(false)
    }
  }

  const content = (
    <a
      href={item.href || '#'}
      onClick={(e) => {
        if (hasChildren) {
          e.preventDefault()
          setExpanded((prev) => !prev)
        } else if (onNavigate && item.href) {
          e.preventDefault()
          onNavigate(item.href)
        }
        item.onClick?.()
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'admin-sidebar__nav-item',
        isCurrent && 'admin-sidebar__nav-item--active',
        collapsed ? 'justify-center px-0' : '',
      )}
    >
      {item.icon && (
        <span
          className={cn(
            'shrink-0 transition-colors',
            isCurrent ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
          )}
        >
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full bg-brand/10 text-brand border border-brand/20">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span
              className="shrink-0 transition-transform duration-[var(--motion-fast)]"
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
        <ul className="mt-1 pl-8 space-y-1 animate-in slide-in-from-top-2 duration-[var(--motion-fast)]">
          {item.children!.map((child, idx) => (
            <li key={idx}>
              <a
                href={child.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate(child.href)
                  }
                }}
                className={cn(
                  'block py-1.5 text-sm transition-colors',
                  child.isActive || (currentPath && child.href === currentPath)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
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
  onNavigate,
  currentPath,
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
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && !collapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                {group.label}
              </p>
            )}
            {group.label && collapsed && (
              <div className="h-px bg-border/50 mx-2 mb-3" /> // Divider for collapsed groups
            )}
            <ul className="space-y-0.5">
              {group.items.map((item, i) => (
                <NavItem
                  key={i}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                />
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
