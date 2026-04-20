import {
  BarChart3,
  Box,
  HelpCircle,
  LayoutGrid,
  Network,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'
import type { SidebarNavGroup, SidebarNavItem } from './types'
import { cn } from '@ecom/ui'

interface AdminSidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navGroups?: SidebarNavGroup[]
  footerNav?: SidebarNavItem[]
  currentPath?: string
  onNavigate?: (href: string) => void
}

const DEFAULT_LOGO = (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] bg-brand shadow-sm">
      <LayoutGrid className="w-[var(--space-4)] h-[var(--space-4)] text-brand-foreground" />
    </div>
    <span className="text-xl font-bold tracking-tight text-foreground">EzMart</span>
  </div>
)

const FALLBACK_NAV: SidebarNavGroup[] = [
  {
    label: 'MAIN',
    items: [
      {
        label: 'Dashboard',
        icon: <LayoutGrid className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/dashboard',
        isActive: true,
      },
      {
        label: 'Orders',
        icon: <ShoppingCart className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/orders',
      },
      {
        label: 'Products',
        icon: <Box className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/products',
      },
      {
        label: 'Customers',
        icon: <Users className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/customers',
      },
      {
        label: 'Reports',
        icon: <BarChart3 className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/reports',
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        label: 'Promotions',
        icon: <Tag className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/promotions',
      },
      {
        label: 'Settings',
        icon: <Settings className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/settings',
      },
    ],
  },
]

const FALLBACK_FOOTER: SidebarNavItem[] = [
  {
    label: 'Integrations',
    icon: <Network className="w-[var(--space-4)] h-[var(--space-4)]" />,
    href: '/integrations',
  },
  {
    label: 'Help & Support',
    icon: <HelpCircle className="w-[var(--space-4)] h-[var(--space-4)]" />,
    href: '/help',
  },
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

  const navItemClasses = (item: SidebarNavItem) => {
    const active = item.isActive || isCurrent(item.href)
    return cn(
      'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-[15px] font-medium no-underline transition-all duration-[var(--motion-fast)] tracking-wide',
      active
        ? 'bg-brand text-brand-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-interactive-hover hover:text-foreground',
    )
  }

  const iconClasses = (item: SidebarNavItem) =>
    cn(
      'shrink-0 w-[var(--space-4)] h-[var(--space-4)] transition-colors',
      item.isActive || isCurrent(item.href)
        ? 'text-brand-foreground'
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
        <span className="flex-1 truncate">{item.label}</span>
      </a>
    </li>
  )

  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-background border-r border-subtle',
        className,
      )}
      {...props}
    >
      {/* Brand logo area */}
      <div className="flex h-[4.5rem] shrink-0 items-center px-6">{logo ?? DEFAULT_LOGO}</div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
        {(navGroups ?? FALLBACK_NAV).map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-3 pt-3 border-t border-subtle')}>
            {group.label && (
              <p className="px-3 mb-1.5 text-micro font-semibold text-muted-foreground uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">{group.items.map((item, ii) => renderNavItem(item, ii))}</ul>
          </div>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto px-3 pb-6 pt-3">
        <div className="border-t border-subtle pt-3">
          <ul className="space-y-1">
            {(footerNav ?? FALLBACK_FOOTER).map((item, ii) => renderNavItem(item, ii))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export { AdminSidebar }
export type { AdminSidebarProps }
