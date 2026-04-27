'use client'

import { cn } from '@ecom/ui'
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import React, { useState } from 'react'
import { DefaultLogo, FALLBACK_FOOTER, FALLBACK_NAV } from './AdminSidebar.fixtures'
import type { SidebarNavGroup, SidebarNavItem } from './types'

interface NavItemProps {
  item: SidebarNavItem
  active: boolean
  collapsed?: boolean
  onNavigate?: (href: string) => void
}

const NavItem = React.memo(function NavItem({ item, active, collapsed, onNavigate }: NavItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const [isExpanded, setIsExpanded] = useState(
    active || (hasChildren && item.children?.some((c) => c.isActive)),
  )

  const handleParentClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      // Toggle expansion when clicking an item with children
      setIsExpanded(!isExpanded)

      // If there's no actual link to navigate to, prevent default
      if (!item.href || item.href === '#') {
        e.preventDefault()
      }
    } else {
      if (onNavigate && item.href && item.href !== '#') {
        e.preventDefault()
        onNavigate(item.href)
      }
      item.onClick?.()
    }
  }

  return (
    <li className="flex flex-col gap-1">
      <a
        href={item.href || '#'}
        onClick={handleParentClick}
        title={collapsed ? item.label : undefined}
        className={cn(
          'relative flex items-center rounded-[var(--radius-md)] no-underline',
          collapsed ? 'mx-auto h-10 w-10 justify-center gap-0 p-0' : 'gap-3 px-3 py-2',
          'text-[length:var(--text-nav-label)]',
          'transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--motion-ease-default)] cursor-pointer group',
          'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
          active
            ? 'bg-[rgb(var(--brand-500-rgb)/0.1)] text-[var(--text-brand)] font-semibold'
            : 'font-medium text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
        )}
      >
        {active && !collapsed && (
          <span
            className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 h-[60%] min-h-[1.25rem] w-[var(--sidebar-accent-bar-width)] rounded-[var(--radius-full)] bg-[var(--action-primary)]"
            aria-hidden="true"
          />
        )}
        {item.icon && (
          <span className="shrink-0 flex items-center justify-center w-4 h-4">{item.icon}</span>
        )}
        {!collapsed && (
          <span className={cn('flex-1 truncate', active ? 'font-semibold' : 'font-medium')}>
            {item.label}
          </span>
        )}

        {hasChildren && !collapsed && (
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform duration-[var(--duration-fast)]',
              isExpanded && 'rotate-90',
              active
                ? 'text-[var(--text-brand)]/70'
                : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]',
            )}
          />
        )}
      </a>

      {hasChildren && !collapsed && (
        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out',
            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <ul className="flex flex-col gap-1 overflow-hidden ml-[22px] border-l border-[var(--border-subtle)] pl-3">
            {item.children!.map((child, idx) => {
              const isChildActive = child.isActive
              return (
                <li key={idx}>
                  <a
                    href={child.href}
                    onClick={(e) => {
                      if (onNavigate && child.href) {
                        e.preventDefault()
                        onNavigate(child.href)
                      }
                    }}
                    className={cn(
                      'block rounded-[var(--radius-sm)] px-3 py-1.5 text-[length:var(--text-nav-label)]',
                      'transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--motion-ease-default)]',
                      'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                      isChildActive
                        ? 'text-[var(--text-brand)] font-semibold bg-[rgb(var(--brand-500-rgb)/0.08)]'
                        : 'text-[var(--text-tertiary)] font-medium hover:text-[var(--text-primary)] hover:bg-[var(--state-hover)]',
                    )}
                  >
                    {child.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </li>
  )
})

interface AdminSidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode | ((collapsed: boolean) => React.ReactNode)
  navGroups?: SidebarNavGroup[]
  footerNav?: SidebarNavItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

function AdminSidebar({
  logo,
  navGroups,
  footerNav,
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  className,
  ...props
}: AdminSidebarProps) {
  const isCurrent = (href?: string) => href === currentPath
  const isActive = (item: SidebarNavItem) => item.isActive || isCurrent(item.href)

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-[var(--layer-overlay)]',
        collapsed
          ? 'lg:w-[var(--admin-sidebar-collapsed-width)]'
          : 'lg:w-[var(--admin-sidebar-width)]',
        'bg-[var(--surface-base)] border-r border-[var(--border-subtle)]',
        'transition-[width] duration-[var(--duration-normal)] ease-[var(--motion-ease-default)]',
        className,
      )}
      {...props}
    >
      {/* Brand logo area — height matches header */}
      <div
        className={cn(
          'flex shrink-0 items-center h-[var(--admin-header-height)] overflow-hidden transition-all',
          collapsed ? 'justify-center px-0' : 'px-6',
        )}
      >
        <div className="truncate shrink-0">
          {typeof logo === 'function'
            ? logo(collapsed ?? false)
            : (logo ?? <DefaultLogo collapsed={collapsed} />)}
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto custom-scrollbar flex flex-col',
          collapsed ? 'p-2 items-center' : 'p-3',
        )}
      >
        {(navGroups ?? FALLBACK_NAV).map((group, gi) => (
          <div
            key={gi}
            className={cn('w-full', gi > 0 && 'mt-3 pt-3 border-t border-[var(--border-subtle)]')}
          >
            {group.label && !collapsed && (
              <p className="px-3 mb-2 text-[length:var(--text-sidebar-group-label)] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-1 w-full">
              {group.items.map((item, ii) => (
                <NavItem
                  key={ii}
                  item={item}
                  active={isActive(item)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className={cn('mt-auto', collapsed ? 'px-2 pb-4 pt-2' : 'px-3 pb-4 pt-3')}>
        {(footerNav ?? FALLBACK_FOOTER).length > 0 && (
          <div className="border-t border-[var(--border-subtle)] pt-3 w-full">
            <ul className="flex flex-col gap-1 w-full">
              {(footerNav ?? FALLBACK_FOOTER).map((item, ii) => (
                <NavItem
                  key={ii}
                  item={item}
                  active={isActive(item)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <div
          className={cn(
            'border-t border-[var(--border-subtle)] pt-3 mt-3 w-full',
            (footerNav ?? FALLBACK_FOOTER).length === 0 && 'border-t-0 pt-0',
          )}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center rounded-[var(--radius-md)] p-2 text-[var(--text-secondary)]',
              'transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--motion-ease-default)] outline-none',
              'hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
              'focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
              collapsed ? 'mx-auto h-10 w-10 justify-center' : 'justify-start gap-3 px-3',
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
            {!collapsed && (
              <span className="font-medium text-[length:var(--text-nav-label)]">Collapse menu</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}

export { AdminSidebar }
export type { AdminSidebarProps }
