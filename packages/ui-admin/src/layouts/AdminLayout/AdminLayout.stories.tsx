import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { BarChart3, Bell, LayoutDashboard, Mail, Package, ShoppingCart, Tag, Users, Zap } from 'lucide-react'

import { AdminHeader } from '../../organisms/AdminHeader/AdminHeader'
import type { NotificationItem } from '../../organisms/NotificationPanel/NotificationPanel'
import { AdminSidebar } from '../../organisms/sidebar/AdminSidebar'
import type { AdminLayoutProps } from './AdminLayout'
import { AdminLayout } from './AdminLayout'

const meta: Meta<typeof AdminLayout> = {
  title: 'layouts/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AdminLayout>

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'layout-notif-1',
    title: 'Payout processed',
    message: "Today's seller payout has been completed.",
    read: true,
    timestamp: '6 min ago',
    type: 'success',
  },
  {
    id: 'layout-notif-2',
    title: 'New return request',
    message: 'Order #ORD-7712 has a pending return review.',
    read: false,
    timestamp: '34 min ago',
    type: 'order',
  },
]

const MAIN_NAV = [
  {
    label: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: <LayoutDashboard className="w-[var(--space-4)] h-[var(--space-4)]" />,
        isActive: true,
      },
      {
        label: 'Orders',
        href: '/admin/orders',
        icon: <ShoppingCart className="w-4 h-4" />,
        badge: 12,
      },
      {
        label: 'Products',
        href: '#',
        icon: <Package className="w-4 h-4" />,
        children: [
          { label: 'All Products', href: '/admin/products' },
          { label: 'Categories', href: '/admin/products/categories' },
          { label: 'Inventory', href: '/admin/products/inventory' },
        ],
      },
      {
        label: 'Customers',
        href: '/admin/customers',
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: 'Promotions',
        href: '/admin/promotions',
        icon: <Tag className="w-4 h-4" />,
      },
      {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Integrations',
        href: '/admin/integrations',
        icon: <Zap className="w-4 h-4" />,
      },
    ],
  },
]

const FOOTER_NAV = [
  {
    label: 'Help & Support',
    href: '/admin/help',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

function PlaceholderContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border bg-background shadow-sm" />
        ))}
      </div>
      <div className="h-64 rounded-xl border bg-background shadow-sm" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 rounded-xl border bg-background shadow-sm" />
        <div className="h-48 rounded-xl border bg-background shadow-sm" />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => {
    return (
      <AdminLayout {...(args as AdminLayoutProps & { children?: React.ReactNode })}>
        <PlaceholderContent />
      </AdminLayout>
    )
  },
  args: {
    currentPath: '/admin',
    onNavigate: (href) => console.log('Navigate to:', href),
    sidebarProps: {
      navGroups: MAIN_NAV,
      footerNav: FOOTER_NAV,
    },
    headerProps: {
      title: 'Dashboard',
      search: {
        placeholder: 'Search anything...',
        onChange: (v) => console.log('Search:', v),
        onSearch: (v) => console.log('Submit:', v),
      },
      user: {
        name: 'Marcus George',
        role: 'Admin',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
      iconButtons: [{ label: 'Messages', icon: <Mail className="w-[var(--space-4)] h-[var(--space-4)]" /> }],
      notificationPanel: {
        notifications: SAMPLE_NOTIFICATIONS,
      },
    },
  },
}

export const WithCurrentPath: Story = {
  render: (args) => {
    return (
      <AdminLayout {...(args as AdminLayoutProps & { children?: React.ReactNode })}>
        <PlaceholderContent />
      </AdminLayout>
    )
  },
  args: {
    currentPath: '/admin/orders',
    onNavigate: (href) => console.log('Navigate to:', href),
    sidebarProps: {
      navGroups: MAIN_NAV,
      footerNav: FOOTER_NAV,
    },
    headerProps: {
      user: {
        name: 'Marcus George',
        role: 'Admin',
      },
      iconButtons: [
        { label: 'Messages', icon: <Mail className="w-5 h-5" /> },
        { label: 'Notifications', icon: <Bell className="w-5 h-5" />, hasNotification: true },
      ],
    },
  },
}

export const SearchDisabled: Story = {
  render: (args) => {
    return (
      <AdminLayout {...(args as AdminLayoutProps & { children?: React.ReactNode })}>
        <PlaceholderContent />
      </AdminLayout>
    )
  },
  args: {
    sidebarProps: {
      navGroups: MAIN_NAV,
      footerNav: FOOTER_NAV,
    },
    headerProps: {
      search: false,
      user: {
        name: 'Marcus George',
        role: 'Admin',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
    },
  },
}

export const CustomSidebarAndHeader: Story = {
  render: (args) => {
    return (
      <AdminLayout {...(args as AdminLayoutProps & { children?: React.ReactNode })}>
        <PlaceholderContent />
      </AdminLayout>
    )
  },
  args: {
    sidebar: (
      <AdminSidebar
        navGroups={[
          {
            label: 'Custom',
            items: [
              {
                label: 'Custom Page',
                href: '/custom',
                icon: <LayoutDashboard className="w-4 h-4" />,
              },
            ],
          },
        ]}
      />
    ),
    header: (
      <AdminHeader
        search={false}
        user={{
          name: 'Custom User',
          role: 'Editor',
        }}
      />
    ),
  },
}

export const Minimal: Story = {
  render: (args) => {
    return (
      <AdminLayout {...(args as AdminLayoutProps & { children?: React.ReactNode })}>
        <PlaceholderContent />
      </AdminLayout>
    )
  },
  args: {
    sidebarProps: {
      navGroups: [],
      footerNav: [],
    },
    headerProps: {
      search: false,
      user: false,
    },
  },
}
