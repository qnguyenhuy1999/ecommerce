import type { Meta } from '@storybook/react'

import { Sidebar } from './index'
import type { SidebarProps } from './types'

const meta = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>

export default meta

const DASHBOARD_GROUP = {
  label: 'Dashboard',
  items: [
    { label: 'Overview', href: '#', icon: <span>📊</span> },
    { label: 'Analytics', href: '#', icon: <span>📈</span> },
  ],
}

const PRODUCTS_GROUP = {
  label: 'Catalog',
  items: [
    { label: 'Products', href: '#', icon: <span>📦</span>, badge: '24' },
    { label: 'Categories', href: '#', icon: <span>🏷️</span> },
    { label: 'Collections', href: '#', icon: <span>📁</span> },
  ],
}

const ORDERS_GROUP = {
  label: 'Orders',
  items: [
    { label: 'All Orders', href: '#', icon: <span>🛒</span>, badge: '8' },
    { label: 'Pending', href: '#', icon: <span>⏳</span> },
    { label: 'Completed', href: '#', icon: <span>✅</span> },
  ],
}

export const Default = {
  args: {
    logo: <span style={{ fontWeight: 700, fontSize: '1rem' }}>Admin Panel</span>,
    navGroups: [DASHBOARD_GROUP, PRODUCTS_GROUP, ORDERS_GROUP],
    footer: <div style={{ fontSize: '0.75rem', color: '#666' }}>v1.0.0</div>,
  } as SidebarProps,
}

export const WithoutBadge = {
  args: {
    logo: <span style={{ fontWeight: 700 }}>ShopAdmin</span>,
    navGroups: [
      { label: 'Dashboard', items: [{ label: 'Home', href: '#' }] },
      { label: 'Settings', items: [{ label: 'Profile', href: '#' }] },
    ],
  } as SidebarProps,
}
