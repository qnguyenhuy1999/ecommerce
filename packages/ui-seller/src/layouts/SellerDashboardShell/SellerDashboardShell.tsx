'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Typography } from '@ecom/core-ui'
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Upload,
  Warehouse,
  X,
} from 'lucide-react'

type SellerDashboardNavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: SellerDashboardNavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/vouchers', label: 'Vouchers', icon: Tag },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/bulk', label: 'Bulk Operations', icon: Upload },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/messages', label: 'Chat', icon: MessageSquare },
  { href: '/returns', label: 'Returns', icon: RotateCcw },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { href: '/metrics', label: 'Performance', icon: TrendingUp },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/shop-profile', label: 'Shop Settings', icon: Store },
]

export interface SellerDashboardShellProps {
  children: ReactNode
  pathname: string
  loading?: boolean
  chatUnreadCount?: number
  notificationCount?: number
  onLogout?: () => void | Promise<void>
}

export function SellerDashboardShell({
  children,
  pathname,
  loading = false,
  chatUnreadCount = 0,
  notificationCount = 0,
  onLogout,
}: SellerDashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navContent = (
    <nav className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4">
        <Typography as="h1" variant="h3" className="text-gray-900">
          Seller Center
        </Typography>
      </div>

      <div className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === '/messages' && chatUnreadCount > 0 ? (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {chatUnreadCount}
                </span>
              ) : null}
              {item.href === '/notifications' && notificationCount > 0 ? (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {notificationCount}
                </span>
              ) : null}
            </a>
          )
        })}
      </div>

      <div className="border-t border-gray-200 p-2">
        <button
          onClick={() => {
            void onLogout?.()
            setMobileOpen(false)
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button
        onClick={() => setMobileOpen((value) => !value)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      <main className="flex-1 lg:ml-0">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
