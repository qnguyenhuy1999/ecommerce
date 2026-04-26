

import type { Meta, StoryObj } from '@storybook/react'

import { AccountOrderLayout } from './AccountOrderLayout'
import { DEFAULT_ACCOUNT_NAV_ITEMS } from '../../molecules/AccountSidebar/AccountSidebar'

const ITEMS = [
  { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', title: 'Headphones' },
  { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', title: 'Watch' },
]

const ORDERS = [
  {
    orderNumber: 'ORD-20240420-001',
    date: 'Apr 20, 2024',
    status: 'SHIPPED' as const,
    items: ITEMS,
    itemCount: 2,
    total: 349.97,
    onView: () => console.log('View'),
    onTrack: () => console.log('Track'),
  },
  {
    orderNumber: 'ORD-20240315-042',
    date: 'Mar 15, 2024',
    status: 'COMPLETED' as const,
    items: [ITEMS[0]],
    itemCount: 1,
    total: 149.98,
    onView: () => console.log('View'),
    onReorder: () => console.log('Reorder'),
  },
]

const meta: Meta<typeof AccountOrderLayout> = {
  title: 'Layouts/AccountOrderLayout',
  component: AccountOrderLayout,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AccountOrderLayout>

const sidebarProps = {
  user: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    initials: 'JD',
  },
  items: DEFAULT_ACCOUNT_NAV_ITEMS,
  activeItem: 'orders',
  onItemClick: () => {},
  onLogout: () => {},
}

export const WithOrders: Story = {
  args: {
    sidebarProps,
    orders: ORDERS,
  },
}

export const EmptyState: Story = {
  args: {
    sidebarProps,
    orders: [],
    onStartShopping: () => alert('Start shopping'),
  },
}
