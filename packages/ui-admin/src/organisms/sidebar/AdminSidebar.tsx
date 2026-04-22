import type { SidebarNavGroup, SidebarNavItem } from './types'
import { cn } from '@ecom/ui'
import { DEFAULT_LOGO, FALLBACK_NAV, FALLBACK_FOOTER } from './AdminSidebar.fixtures'

interface AdminSidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navGroups?: SidebarNavGroup[]
  footerNav?: SidebarNavItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
}

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
  const isActive = (item: SidebarNavItem) => item.isActive || isCurrent(item.href)

  const renderNavItem = (item: SidebarNavItem, key: number | string) => {
    const active = isActive(item)
    return (
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
          className={cn(
            'flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)]',
            'px-[var(--space-3)] py-[var(--space-2)]',
            'text-[length:var(--text-nav-label)] no-underline',
            'transition-colors duration-[var(--duration-fast)] cursor-pointer',
            active
              ? 'bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold'
              : 'font-medium text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
          )}
        >
          {item.icon && (
            <span className="shrink-0 flex items-center justify-center w-[var(--space-4)] h-[var(--space-4)]">
              {item.icon}
            </span>
          )}
          <span className="flex-1 truncate">{item.label}</span>
        </a>
      </li>
    )
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64',
        'bg-[var(--surface-base)] border-r border-[var(--border-subtle)]',
        className,
      )}
      {...props}
    >
      {/* Brand logo area — height matches header */}
      <div className="flex shrink-0 items-center h-[var(--admin-header-height)] px-[var(--space-6)]">
        {logo ?? DEFAULT_LOGO}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-[var(--space-3)] custom-scrollbar">
        {(navGroups ?? FALLBACK_NAV).map((group, gi) => (
          <div
            key={gi}
            className={cn(
              gi > 0 &&
                'mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle)]',
            )}
          >
            {group.label && (
              <p className="px-[var(--space-3)] mb-[var(--space-2)] text-[length:var(--text-sidebar-group-label)] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-[var(--space-1)]">
              {group.items.map((item, ii) => renderNavItem(item, ii))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Navigation */}
      {(footerNav ?? FALLBACK_FOOTER).length > 0 && (
        <div className="mt-auto px-[var(--space-3)] pb-[var(--space-6)] pt-[var(--space-3)]">
          <div className="border-t border-[var(--border-subtle)] pt-[var(--space-3)]">
            <ul className="flex flex-col gap-[var(--space-1)]">
              {(footerNav ?? FALLBACK_FOOTER).map((item, ii) => renderNavItem(item, ii))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  )
}

export { AdminSidebar }
export type { AdminSidebarProps }
