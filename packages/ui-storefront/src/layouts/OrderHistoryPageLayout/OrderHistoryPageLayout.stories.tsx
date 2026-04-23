import type { Meta, StoryObj } from '@storybook/react'

import { OrderHistoryPageLayout } from './OrderHistoryPageLayout'

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
]

const ORDERS = [
  {
    orderNumber: 'ORD-20240423-001',
    date: 'Apr 23, 2024',
    status: 'PROCESSING' as const,
    items: IMAGES.map((image, i) => ({ image, title: `Item ${i}` })),
    itemCount: 3,
    total: 839.97,
    onView: () => alert('view'),
  },
  {
    orderNumber: 'ORD-20240415-042',
    date: 'Apr 15, 2024',
    status: 'SHIPPED' as const,
    items: IMAGES.slice(0, 2).map((image, i) => ({ image, title: `Item ${i}` })),
    itemCount: 2,
    total: 449.98,
    onView: () => alert('view'),
    onTrack: () => alert('track'),
  },
  {
    orderNumber: 'ORD-20240310-007',
    date: 'Mar 10, 2024',
    status: 'COMPLETED' as const,
    items: IMAGES.slice(0, 1).map((image) => ({ image, title: 'Item' })),
    itemCount: 1,
    total: 349.99,
    onView: () => alert('view'),
    onReorder: () => alert('reorder'),
  },
  {
    orderNumber: 'ORD-20240201-003',
    date: 'Feb 1, 2024',
    status: 'CANCELLED' as const,
    items: IMAGES.map((image, i) => ({ image, title: `Item ${i}` })),
    itemCount: 4,
    total: 199.96,
    onView: () => alert('view'),
  },
]

const meta: Meta<typeof OrderHistoryPageLayout> = {
  title: 'Layouts/OrderHistoryPageLayout',
  component: OrderHistoryPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof OrderHistoryPageLayout>

export const AllOrders: Story = {
  args: {
    orders: ORDERS,
    statusFilter: 'all',
    onStatusChange: (s) => alert(`Filter: ${s}`),
  },
}

export const EmptyOrders: Story = {
  args: {
    orders: [],
    statusFilter: 'all',
  },
}
