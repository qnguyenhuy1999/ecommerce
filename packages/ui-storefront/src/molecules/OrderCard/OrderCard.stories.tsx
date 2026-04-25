import type { Meta, StoryObj } from '@storybook/react'

import { OrderCard } from './OrderCard'

const ITEMS = [
  { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', title: 'Headphones' },
  { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', title: 'Watch' },
  { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', title: 'Sneakers' },
  { image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200', title: 'Running Shoes' },
]

const meta: Meta<typeof OrderCard> = {
  title: 'Molecules/OrderCard',
  component: OrderCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-base)]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof OrderCard>

export const Shipped: Story = {
  args: {
    orderNumber: 'ORD-20240420-001',
    date: 'Apr 20, 2024',
    status: 'SHIPPED',
    items: ITEMS,
    itemCount: 4,
    total: 349.97,
    onView: () => alert('View'),
    onTrack: () => alert('Track'),
  },
}

export const Completed: Story = {
  args: {
    orderNumber: 'ORD-20240315-042',
    date: 'Mar 15, 2024',
    status: 'COMPLETED',
    items: ITEMS.slice(0, 2),
    itemCount: 2,
    total: 149.98,
    onView: () => alert('View'),
    onReorder: () => alert('Buy again'),
    onWriteReview: () => alert('Write review'),
    onDownloadInvoice: () => alert('Download invoice'),
  },
}

export const Processing: Story = {
  args: {
    orderNumber: 'ORD-20240425-088',
    date: 'Apr 25, 2024',
    status: 'PROCESSING',
    items: ITEMS.slice(0, 3),
    itemCount: 3,
    total: 219.97,
    onView: () => alert('View'),
    onCancel: () => alert('Cancel'),
    onChangeAddress: () => alert('Change address'),
  },
}

export const PendingPayment: Story = {
  args: {
    orderNumber: 'ORD-20240423-099',
    date: 'Apr 23, 2024',
    status: 'PENDING_PAYMENT',
    items: ITEMS.slice(0, 1),
    itemCount: 1,
    total: 129.99,
    onView: () => alert('View'),
  },
}

export const Cancelled: Story = {
  args: {
    orderNumber: 'ORD-20240101-007',
    date: 'Jan 1, 2024',
    status: 'CANCELLED',
    items: ITEMS,
    itemCount: 5,
    total: 89.95,
    onView: () => alert('View'),
    onReorder: () => alert('Reorder'),
  },
}
