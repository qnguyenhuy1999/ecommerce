import { cn } from '@ecom/ui/utils'

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

// Exported for consumers and tests
export const DefaultLogo = ({ collapsed }: { collapsed?: boolean }) => (
  <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
    <div className="shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--action-primary)] w-9 h-9">
      <LayoutGrid className="w-4 h-4 text-[var(--action-primary-foreground)]" />
    </div>
    {!collapsed && (
      <span className="text-[length:var(--text-sidebar-logo)] font-bold tracking-[-0.01em] text-[var(--text-primary)]">
        EzMart
      </span>
    )}
  </div>
)

// Maintained for backward compatibility if any old files used it
export const DEFAULT_LOGO = <DefaultLogo />

export const FALLBACK_NAV: SidebarNavGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: <LayoutGrid className="w-4 h-4" />,
        href: '/dashboard',
        isActive: true,
      },
      {
        label: 'Orders',
        icon: <ShoppingCart className="w-4 h-4" />,
        href: '/orders',
      },
      {
        label: 'Products',
        icon: <Box className="w-4 h-4" />,
        href: '#', // using # to prevent standard navigation and just expand
        children: [
          { label: 'All Products', href: '/products' },
          { label: 'Categories', href: '/products/categories' },
          { label: 'Inventory', href: '/products/inventory', isActive: true },
        ],
      },
      {
        label: 'Customers',
        icon: <Users className="w-4 h-4" />,
        href: '/customers',
      },
      {
        label: 'Reports',
        icon: <BarChart3 className="w-4 h-4" />,
        href: '/reports',
      },
      {
        label: 'Discounts',
        icon: <Tag className="w-4 h-4" />,
        href: '/discounts',
      },
    ],
  },
  {
    items: [
      {
        label: 'Integrations',
        icon: <Network className="w-4 h-4" />,
        href: '/integrations',
      },
      {
        label: 'Help',
        icon: <HelpCircle className="w-4 h-4" />,
        href: '/help',
      },
      {
        label: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        href: '/settings',
      },
    ],
  },
]

export const FALLBACK_FOOTER: SidebarNavItem[] = []
