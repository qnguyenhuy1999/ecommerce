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
  const nestedListId = React.useId()
  const [expanded, setExpanded] = React.useState(
    item.children?.some((c) => c.isActive || (currentPath && c.href === currentPath)) ?? false,
  )
  const hasChildren = item.children && item.children.length > 0
  const isCurrent =
    item.isActive ||
    (currentPath && item.href === currentPath) ||
    (typeof window !== 'undefined' && window.location.pathname === item.href)

  React.useEffect(() => {
    if (!hasChildren) return
    const shouldBeExpanded =
      item.children?.some((c) => c.isActive || (currentPath && c.href === currentPath)) ?? false
    if (shouldBeExpanded) setExpanded(true)
  }, [currentPath, hasChildren, item.children])

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
      aria-current={isCurrent ? 'page' : undefined}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-controls={hasChildren ? nestedListId : undefined}
      className={cn(
        'group flex items-center font-medium transition-all relative',
        isCurrent
          ? 'bg-brand text-white shadow-md'
          : 'text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
        collapsed
          ? 'justify-center w-10 h-10 p-0 mx-auto rounded-full'
          : 'w-full gap-3 px-3 py-2 rounded-full text-[var(--text-nav-label)]',
      )}
    >
      {item.icon && (
        <span
          className={cn(
            'shrink-0 transition-colors',
            isCurrent ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]',
          )}
        >
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="inline-flex items-center justify-center min-w-[var(--space-5)] h-[18px] px-1.5 text-[var(--text-micro)] font-bold rounded-full bg-brand/10 text-brand">
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
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <li>{content}</li>
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <li>
      {content}
      {hasChildren && expanded && !collapsed && (
        <ul
          id={nestedListId}
          className="mt-1 pl-8 space-y-1 animate-in slide-in-from-top-2 duration-[var(--motion-fast)]"
        >
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
                  'block py-1.5 text-[var(--text-nav-label)] transition-colors',
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
  variant = 'fixed',
  onNavigate,
  currentPath,
  className,
  ...props
}: SidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={cn(
          'admin-sidebar',
          collapsed && 'admin-sidebar--collapsed',
          variant === 'embedded' && 'admin-sidebar--embedded',
          className,
        )}
        {...props}
      >
        {logo && (
          <div
            className={cn(
              'h-14 flex items-center shrink-0 border-b border-subtle',
              collapsed
                ? 'justify-center px-0 text-lg font-extrabold tracking-tight text-foreground'
                : 'px-5 text-[var(--text-sidebar-logo)] font-extrabold tracking-tight text-foreground',
            )}
          >
            {logo}
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
          {navGroups.map((group, gi) => (
            <div key={gi} className={cn(collapsed ? 'flex flex-col items-center w-full' : '')}>
              {group.label && !collapsed && (
                <p className="px-3 mb-2 text-[var(--text-sidebar-group-label)] font-extrabold uppercase tracking-widest text-[var(--text-tertiary)]">
                  {group.label}
                </p>
              )}
              {group.label && collapsed && (
                <div className="w-3.5 h-px bg-[var(--border-subtle)] mx-auto mb-2" />
              )}
              <ul
                className={cn(
                  collapsed ? 'space-y-2.5 w-full flex flex-col items-center' : 'space-y-0.5',
                )}
              >
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
    </TooltipProvider>
  )
}

export { Sidebar }
export type { SidebarProps, SidebarNavGroup, SidebarNavItem }
