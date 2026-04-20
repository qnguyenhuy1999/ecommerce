import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
  BarChart3,
  Zap,
} from 'lucide-react'

import { AdminSidebar } from './AdminSidebar'
import type { AdminSidebarProps } from './AdminSidebar'

const meta: Meta<typeof AdminSidebar> = {
  title: 'organisms/AdminSidebar',
  component: AdminSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AdminSidebar>

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl grid grid-cols-[auto_1fr] gap-6">
        {children}
      </div>
    </div>
  )
}

function PlaceholderContent() {
  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold leading-none">Page Content</h2>
        <p className="text-sm text-muted-foreground">
          Sidebar navigation targets this content area.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

const MAIN_NAV_GROUPS = [
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
        icon: <ShoppingCart className="w-[var(--space-4)] h-[var(--space-4)]" />,
        badge: 12,
      },
      {
        label: 'Products',
        href: '/admin/products',
        icon: <Package className="w-[var(--space-4)] h-[var(--space-4)]" />,
      },
      {
        label: 'Customers',
        href: '/admin/customers',
        icon: <Users className="w-[var(--space-4)] h-[var(--space-4)]" />,
      },
      {
        label: 'Promotions',
        href: '/admin/promotions',
        icon: <Tag className="w-[var(--space-4)] h-[var(--space-4)]" />,
      },
      {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: <BarChart3 className="w-[var(--space-4)] h-[var(--space-4)]" />,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Integrations',
        href: '/admin/integrations',
        icon: <Zap className="w-[var(--space-4)] h-[var(--space-4)]" />,
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
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
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
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

export const Default: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: MAIN_NAV_GROUPS,
    footerNav: FOOTER_NAV,
    currentPath: '/admin',
    onNavigate: (href) => console.log('Navigate to:', href),
  } as Partial<AdminSidebarProps>,
}

export const WithCurrentPath: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: MAIN_NAV_GROUPS,
    footerNav: FOOTER_NAV,
    currentPath: '/admin/orders',
    onNavigate: (href) => console.log('Navigate to:', href),
  } as Partial<AdminSidebarProps>,
}

export const CustomLogo: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar
        {...args}
        logo={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-extrabold text-base">S</span>
            </div>
            <span className="text-[var(--text-sidebar-logo)] font-extrabold tracking-tight text-foreground">
              SuperStore
            </span>
          </div>
        }
      />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: MAIN_NAV_GROUPS,
    footerNav: FOOTER_NAV,
  } as Partial<AdminSidebarProps>,
}

export const NoFooterNav: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: MAIN_NAV_GROUPS,
    footerNav: undefined,
  } as Partial<AdminSidebarProps>,
}

export const NoNavGroups: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: [],
  } as Partial<AdminSidebarProps>,
}

export const EmptyFooter: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} footerNav={[]} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: MAIN_NAV_GROUPS,
    footerNav: [],
  } as Partial<AdminSidebarProps>,
}

export const NoBadge: Story = {
  render: (args) => (
    <Frame>
      <AdminSidebar {...args} />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: [
      {
        label: 'Main',
        items: [
          {
            label: 'Dashboard',
            href: '/admin',
            icon: <LayoutDashboard className="w-[var(--space-4)] h-[var(--space-4)]" />,
          },
          {
            label: 'Orders',
            href: '/admin/orders',
            icon: <ShoppingCart className="w-[var(--space-4)] h-[var(--space-4)]" />,
          },
          {
            label: 'Products',
            href: '/admin/products',
            icon: <Package className="w-[var(--space-4)] h-[var(--space-4)]" />,
          },
        ],
      },
    ],
    footerNav: FOOTER_NAV,
  } as Partial<AdminSidebarProps>,
}