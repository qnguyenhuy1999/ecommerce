'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  BarChart3,
  Box,
  LayoutGrid,
  ShieldCheck,
  ShoppingCart,
  Users,
} from 'lucide-react'

import {
  AdminHeader,
  AdminLayout,
  AdminSidebar,
} from '@ecom/ui-admin'

const NAV = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: <LayoutGrid className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/',
      },
      {
        label: 'Sellers',
        icon: <ShieldCheck className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/sellers',
      },
      {
        label: 'Orders',
        icon: <ShoppingCart className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/orders',
      },
      {
        label: 'Products',
        icon: <Box className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/inventory',
      },
      {
        label: 'Customers',
        icon: <Users className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/customers',
      },
      {
        label: 'Payouts',
        icon: <BarChart3 className="w-[var(--space-4)] h-[var(--space-4)]" />,
        href: '/payouts',
      },
    ],
  },
]

/** Stable admin user object — declared once at module scope. */
const ADMIN_USER = { name: 'Admin', email: 'admin@marketplace', initials: 'AD' } as const

const renderLogo = (collapsed: boolean) => (
  <div className={collapsed ? 'flex justify-center' : 'flex items-center gap-2'}>
    <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--action-primary)]">
      <LayoutGrid className="h-4 w-4 text-[var(--action-primary-foreground)]" />
    </div>
    {!collapsed && <span className="text-base font-bold">Admin</span>}
  </div>
)

export interface AdminShellProps {
  title?: string
  children: React.ReactNode
}

/**
 * Admin shell wraps every admin page. Memoised so a route change inside the
 * shell (e.g. /orders → /sellers) doesn't repaint the sidebar/header. Only
 * `pathname` and `title` invalidate the chrome subtree.
 */
function AdminShellInner({ title, children }: AdminShellProps) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const navigate = React.useCallback((href: string) => router.push(href), [router])

  const sidebar = React.useMemo(
    () => (
      <AdminSidebar
        logo={renderLogo}
        navGroups={NAV}
        currentPath={pathname}
        onNavigate={navigate}
      />
    ),
    [pathname, navigate],
  )

  const header = React.useMemo(
    () => (
      <AdminHeader
        title={title}
        user={ADMIN_USER}
        userMenuItems={false}
        notificationPanel={false}
        search={false}
      />
    ),
    [title],
  )

  return (
    <AdminLayout
      currentPath={pathname}
      onNavigate={navigate}
      sidebar={sidebar}
      header={header}
    >
      {children}
    </AdminLayout>
  )
}

export const AdminShell = React.memo(AdminShellInner)
