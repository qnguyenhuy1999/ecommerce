import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react'

import { AdminLayout } from './index'

const meta: Meta<typeof AdminLayout> = {
  title: 'ui-admin/layouts/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AdminLayout>

const SIDEBAR_NAV = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Overview', href: '#overview', icon: <LayoutDashboard />, isActive: true },
      { label: 'Analytics', href: '#analytics', icon: <BarChart3 /> },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', href: '#products', icon: <Package />, badge: '24' },
      { label: 'Categories', href: '#categories', icon: <ShoppingBag /> },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', href: '#orders', icon: <ShoppingCart />, badge: '8' },
      { label: 'Customers', href: '#customers', icon: <Users /> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'General', href: '#settings', icon: <Settings /> },
    ],
  },
]

export const Default: Story = {
  render: () => (
    <AdminLayout
      sidebar={
        <aside style={{ width: '16rem', height: '100%' }} className="flex flex-col">
          <div className="h-14 flex items-center px-4 border-b">
            <span className="font-bold text-lg">ShopAdmin</span>
          </div>
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
            {SIDEBAR_NAV.map((group, gi) => (
              <div key={gi}>
                <p className="px-2 mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-2 py-1.5 rounded text-sm transition-colors ${
                          item.isActive
                            ? 'bg-brand text-brand-foreground font-medium'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="w-5 h-5">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full bg-brand text-brand-foreground">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      }
      header={
        <div className="flex items-center justify-between px-6 h-14">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="text-sm text-muted-foreground">Sarah Chen</button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-5 border">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">$48,750</p>
          </div>
          <div className="bg-card rounded-lg p-5 border">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="text-2xl font-bold mt-1">1,284</p>
          </div>
          <div className="bg-card rounded-lg p-5 border">
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="text-2xl font-bold mt-1">3,892</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 border">
          <p className="text-sm font-medium text-muted-foreground">Recent Orders</p>
          <div className="mt-4 space-y-2">
            {['ORD-8847', 'ORD-8846', 'ORD-8845'].map((id) => (
              <div key={id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{id}</span>
                <span className="text-sm text-muted-foreground">$149.99</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  ),
}

export const WithNavigationLoading: Story = {
  args: {
    isNavigating: true,
  },
}
