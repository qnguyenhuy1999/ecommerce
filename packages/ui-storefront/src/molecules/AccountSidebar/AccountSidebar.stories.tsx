import type { Meta, StoryObj } from '@storybook/react'
import { Package, User, MapPin, Heart, Settings } from 'lucide-react'

import { AccountSidebar } from './AccountSidebar'

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

const meta: Meta<typeof AccountSidebar> = {
  title: 'Molecules/AccountSidebar',
  component: AccountSidebar,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-xs mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof AccountSidebar>

export const Profile: Story = {
  args: { user: USER, activeItem: 'profile', items: ITEMS, onLogout: () => alert('Logout') },
}

export const Orders: Story = {
  args: { user: USER, activeItem: 'orders', items: ITEMS, onLogout: () => alert('Logout') },
}

export const NoAvatar: Story = {
  args: {
    user: { name: 'John Smith', email: 'john@example.com' },
    activeItem: 'wishlist',
    items: ITEMS,
  },
}
