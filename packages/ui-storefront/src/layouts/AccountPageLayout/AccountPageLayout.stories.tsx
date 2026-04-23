import type { Meta, StoryObj } from '@storybook/react'
import { Package, User, MapPin, Heart, Settings } from 'lucide-react'

import { AccountPageLayout } from './AccountPageLayout'

const USER = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
}

const ITEMS = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" />, badge: '3' },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" />, badge: '12' },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
]

const meta: Meta<typeof AccountPageLayout> = {
  title: 'Layouts/AccountPageLayout',
  component: AccountPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof AccountPageLayout>

export const ProfilePage: Story = {
  args: {
    sidebarProps: {
      user: USER,
      activeItem: 'profile',
      items: ITEMS,
      onLogout: () => alert('logout'),
    },
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">My Profile</h2>
        <p className="text-[var(--text-secondary)] text-sm">Manage your personal information and account settings.</p>
        <div className="h-48 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] text-sm">
          Profile form content goes here
        </div>
      </div>
    ),
  },
}

export const OrdersPage: Story = {
  args: {
    sidebarProps: {
      user: USER,
      activeItem: 'orders',
      items: ITEMS,
      onLogout: () => alert('logout'),
    },
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">My Orders</h2>
        <div className="h-64 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] text-sm">
          Order list content goes here
        </div>
      </div>
    ),
  },
}
