import type { Meta, StoryObj } from '@storybook/react'

import { OrderHistoryPageLayout } from './OrderHistoryPageLayout'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200',
  'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=200',
]

const ALL_STATUSES: OrderStatus[] = [
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'PAID',
  'PENDING_PAYMENT',
]

function makeOrder(i: number) {
  const status = ALL_STATUSES[i % ALL_STATUSES.length]!
  const itemCount = 1 + (i % 5)
  const items = Array.from({ length: Math.min(itemCount, 3) }).map((_, idx) => ({
    image: IMAGES[(i + idx) % IMAGES.length]!,
    title: `Product ${i}-${idx}`,
  }))
  return {
    orderNumber: `ORD-2026-${(1000 + i).toString().padStart(4, '0')}`,
    date: `Apr ${1 + (i % 28)}, 2026`,
    status,
    items,
    itemCount,
    total: 49 + i * 13.7,
    onView: () => alert(`view ${i}`),
    onTrack: status === 'SHIPPED' ? () => alert('track') : undefined,
    onCancel:
      status === 'PROCESSING' || status === 'PAID' || status === 'PENDING_PAYMENT'
        ? () => alert('cancel')
        : undefined,
    onChangeAddress:
      status === 'PROCESSING' || status === 'PAID' ? () => alert('change address') : undefined,
    onReorder:
      status === 'COMPLETED' || status === 'CANCELLED' ? () => alert('reorder') : undefined,
    onWriteReview: status === 'COMPLETED' ? () => alert('write review') : undefined,
    onDownloadInvoice: status === 'COMPLETED' ? () => alert('download invoice') : undefined,
  }
}

const ORDERS = Array.from({ length: 22 }).map((_, i) => makeOrder(i))

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
    activeTab: 'all',
    onTabChange: (tab) => alert(`tab: ${tab}`),
    onDateRangeChange: (v) => alert(`date: ${v}`),
    onStartShopping: () => alert('start shopping'),
  },
}

export const ActiveOnly: Story = {
  args: {
    ...AllOrders.args,
    activeTab: 'active',
  },
}

export const NoMatches: Story = {
  args: {
    ...AllOrders.args,
    searchQuery: 'this-will-never-match',
  },
}

export const EmptyOrders: Story = {
  args: {
    orders: [],
    activeTab: 'all',
    onStartShopping: () => alert('start shopping'),
  },
}
