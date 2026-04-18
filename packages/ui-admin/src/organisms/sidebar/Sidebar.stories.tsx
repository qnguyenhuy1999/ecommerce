import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { LayoutDashboard, ShoppingBag, Package, ShoppingCart, Users, Settings, BarChart3, Tag } from 'lucide-react'

import { Sidebar } from './Sidebar'
import type { SidebarProps } from './types'

const meta: Meta<typeof Sidebar> = {
  title: 'organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Sidebar>

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/30 p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] gap-6">
        {children}
      </div>
    </div>
  )
}

function PlaceholderContent() {
  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold leading-none">Content</h2>
        <p className="text-sm text-muted-foreground">
          This area simulates the main page so the sidebar preview looks correct in Storybook.
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

const FULL_NAV: SidebarProps['navGroups'] = [
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
      { label: 'Collections', href: '#collections', icon: <Tag /> },
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
    items: [{ label: 'General', href: '#settings', icon: <Settings /> }],
  },
]

export const Default: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    logo: <span className="font-bold text-base">ShopAdmin</span>,
    navGroups: FULL_NAV,
    footer: (
      <div className="text-xs text-muted-foreground">
        <span>v1.4.2</span>
      </div>
    ),
  } as SidebarProps,
}

export const WithoutLogo: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    navGroups: FULL_NAV,
  } as SidebarProps,
}

export const Collapsed: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    logo: <span className="font-bold text-base">SA</span>,
    navGroups: FULL_NAV,
    collapsed: true,
  } as SidebarProps,
}

export const WithActiveRoute: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    logo: <span className="font-bold text-base">ShopAdmin</span>,
    navGroups: FULL_NAV,
    currentPath: '#products',
    footer: <div className="text-xs text-muted-foreground">v1.4.2</div>,
  } as SidebarProps,
}

export const WithNestedChildren: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    logo: <span className="font-bold text-base">ShopAdmin</span>,
    navGroups: [
      {
        label: 'Dashboard',
        items: [
          { label: 'Overview', href: '#', icon: <LayoutDashboard /> },
          {
            label: 'Reports',
            href: '#',
            icon: <BarChart3 />,
            children: [
              { label: 'Sales Report', href: '#sales' },
              { label: 'Traffic Report', href: '#traffic' },
              { label: 'Revenue Report', href: '#revenue' },
            ],
          },
        ],
      },
      {
        label: 'Orders',
        items: [
          { label: 'All Orders', href: '#orders', icon: <ShoppingCart />, badge: '8' },
          { label: 'Pending', href: '#pending' },
          { label: 'Completed', href: '#completed' },
        ],
      },
    ],
  } as SidebarProps,
}

export const NoBadge: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args} variant="embedded" />
      <PlaceholderContent />
    </Frame>
  ),
  args: {
    logo: <span className="font-bold text-base">ShopAdmin</span>,
    navGroups: [
      {
        label: 'Dashboard',
        items: [
          { label: 'Home', href: '#' },
          { label: 'Profile', href: '#' },
        ],
      },
      {
        label: 'Settings',
        items: [
          { label: 'General', href: '#' },
          { label: 'Security', href: '#' },
        ],
      },
    ],
  } as SidebarProps,
}
