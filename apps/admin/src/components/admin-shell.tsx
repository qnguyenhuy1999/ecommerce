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
]

const Logo = ({ collapsed }: { collapsed?: boolean }) => (
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

export function AdminShell({ title, children }: AdminShellProps) {
  const router = useRouter()
  const pathname = usePathname() || '/'

  return (
    <AdminLayout
      currentPath={pathname}
      onNavigate={(href) => router.push(href)}
      sidebar={
        <AdminSidebar
          logo={(collapsed) => <Logo collapsed={collapsed} />}
          navGroups={NAV}
          currentPath={pathname}
          onNavigate={(href) => router.push(href)}
        />
      }
      header={
        <AdminHeader
          title={title}
          user={{ name: 'Admin', email: 'admin@marketplace', initials: 'AD' }}
          userMenuItems={false}
          notificationPanel={false}
          search={false}
        />
      }
    >
      {children}
    </AdminLayout>
  )
}
