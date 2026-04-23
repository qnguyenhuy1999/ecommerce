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
    <li className="flex flex-col gap-[var(--space-1)]">
      <a
        href={item.href || '#'}
        onClick={handleParentClick}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center rounded-[var(--radius-md)]',
          collapsed
            ? 'justify-center w-10 h-10 mx-auto p-0 gap-0'
            : 'gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)]',
          'text-[length:var(--text-nav-label)] no-underline',
          'transition-all duration-[var(--duration-fast)] cursor-pointer group',
          active
            ? 'bg-[var(--action-primary)] text-[var(--action-primary-foreground)] shadow-sm'
            : 'font-medium text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
        )}
      >
        {item.icon && (
          <span className="shrink-0 flex items-center justify-center w-[var(--space-4)] h-[var(--space-4)]">
            {item.icon}
          </span>
        )}
        {!collapsed && (
          <span className={cn('flex-1 truncate', active ? 'font-semibold' : 'font-medium')}>
            {item.label}
          </span>
        )}

        {hasChildren && !collapsed && (
          <ChevronRight
            className={cn(
              'w-[var(--space-4)] h-[var(--space-4)] transition-transform duration-200',
              isExpanded && 'rotate-90',
              active
                ? 'text-[var(--action-primary-foreground)]/80'
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
          <ul className="flex flex-col gap-1 overflow-hidden ml-[22px] border-l border-[var(--border-subtle)] pl-[var(--space-3)]">
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
                      'block rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-nav-label)] transition-all',
                      isChildActive
                        ? 'text-[var(--text-primary)] font-semibold bg-[var(--surface-sunken)] shadow-sm'
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
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0',
        collapsed ? 'lg:w-16' : 'lg:w-[var(--admin-sidebar-width)]',
        'bg-[var(--surface-base)] border-r border-[var(--border-subtle)] transition-all duration-[var(--duration-normal)]',
        className,
      )}
      {...props}
    >
      {/* Brand logo area — height matches header */}
      <div
        className={cn(
          'flex shrink-0 items-center h-[var(--admin-header-height)] overflow-hidden transition-all',
          collapsed ? 'justify-center px-0' : 'px-[var(--space-6)]',
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
          collapsed ? 'p-[var(--space-2)] items-center' : 'p-[var(--space-3)]',
        )}
      >
        {(navGroups ?? FALLBACK_NAV).map((group, gi) => (
          <div
            key={gi}
            className={cn(
              'w-full',
              gi > 0 &&
                'mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle)]',
            )}
          >
            {group.label && !collapsed && (
              <p className="px-[var(--space-3)] mb-[var(--space-2)] text-[length:var(--text-sidebar-group-label)] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-[var(--space-1)] w-full">
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
      <div
        className={cn(
          'mt-auto',
          collapsed
            ? 'px-[var(--space-2)] pb-[var(--space-4)] pt-[var(--space-2)]'
            : 'px-[var(--space-3)] pb-[var(--space-4)] pt-[var(--space-3)]',
        )}
      >
        {(footerNav ?? FALLBACK_FOOTER).length > 0 && (
          <div className="border-t border-[var(--border-subtle)] pt-[var(--space-3)] w-full">
            <ul className="flex flex-col gap-[var(--space-1)] w-full">
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
            'border-t border-[var(--border-subtle)] pt-[var(--space-3)] mt-[var(--space-3)] w-full',
            (footerNav ?? FALLBACK_FOOTER).length === 0 && 'border-t-0 pt-0',
          )}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex w-full items-center rounded-[var(--radius-md)] p-[var(--space-2)] text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)] transition-all outline-none focus-visible:ring-[var(--action-primary)]',
              collapsed
                ? 'justify-center w-10 h-10 mx-auto'
                : 'justify-start gap-3 px-[var(--space-3)]',
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-[var(--space-5)] h-[var(--space-5)]" />
            ) : (
              <PanelLeftClose className="w-[var(--space-5)] h-[var(--space-5)]" />
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
