'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { BarChart3, Box, LayoutGrid, ShieldCheck, ShoppingCart, Users } from 'lucide-react'

import { AdminLayout } from '@ecom/ui-admin'

const NAV = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: <LayoutGrid className="w-4 h-4" />,
        href: '/',
      },
      {
        label: 'Sellers',
        icon: <ShieldCheck className="w-4 h-4" />,
        href: '/sellers',
      },
      {
        label: 'Orders',
        icon: <ShoppingCart className="w-4 h-4" />,
        href: '/orders',
      },
      {
        label: 'Products',
        icon: <Box className="w-4 h-4" />,
        href: '/products',
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

  return (
    <AdminLayout>
      <AdminLayout.Sidebar
        logo={renderLogo}
        navGroups={NAV}
        currentPath={pathname}
        onNavigate={navigate}
      />
      <AdminLayout.Header
        title={title}
        user={ADMIN_USER}
        userMenuItems={false}
        notificationPanel={false}
        search={false}
        className="border-b border-(--border-subtle) bg-(--surface-base)"
      />
      <AdminLayout.Main>{children}</AdminLayout.Main>
    </AdminLayout>
  )
}

export const AdminShell = React.memo(AdminShellInner)
