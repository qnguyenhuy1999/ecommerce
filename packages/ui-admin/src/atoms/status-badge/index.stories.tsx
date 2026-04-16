import type { Meta, StoryObj } from '@storybook/react'

import { StatusBadge } from './index'

const meta = {
  title: 'ui-admin/atoms/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusBadge>

export default meta

export const Pending: StoryObj<typeof StatusBadge> = {
  args: { status: 'pending' },
}

export const Processing: StoryObj<typeof StatusBadge> = {
  args: { status: 'processing' },
}

export const Shipped: StoryObj<typeof StatusBadge> = {
  args: { status: 'shipped' },
}

export const Delivered: StoryObj<typeof StatusBadge> = {
  args: { status: 'delivered' },
}

export const Cancelled: StoryObj<typeof StatusBadge> = {
  args: { status: 'cancelled' },
}

export const Refunded: StoryObj<typeof StatusBadge> = {
  args: { status: 'refunded' },
}

export const Failed: StoryObj<typeof StatusBadge> = {
  args: { status: 'failed' },
}

export const AllStatuses: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <StatusBadge status="pending" />
      <StatusBadge status="processing" />
      <StatusBadge status="shipped" />
      <StatusBadge status="delivered" />
      <StatusBadge status="cancelled" />
      <StatusBadge status="refunded" />
      <StatusBadge status="failed" />
    </div>
  ),
}

export const CustomLabel: StoryObj<typeof StatusBadge> = {
  args: {
    status: 'pending',
    label: 'Awaiting Payment',
  },
}
