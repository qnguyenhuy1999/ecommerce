import type { Meta, StoryObj } from '@storybook/react'

import { OrderStatusBadge } from './OrderStatusBadge'
import type { OrderStatus } from './OrderStatusBadge'

const meta: Meta<typeof OrderStatusBadge> = {
  title: 'atoms/OrderStatusBadge',
  component: OrderStatusBadge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof OrderStatusBadge>

const ALL_STATUSES: OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PENDING_REFUND',
]

export const Default: Story = {
  args: {
    status: 'PROCESSING',
  },
}

export const Small: Story = {
  args: {
    status: 'PENDING_PAYMENT',
    size: 'sm',
  },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {ALL_STATUSES.map((status) => (
        <OrderStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
}

export const CompactTableRow: Story = {
  render: () => (
    <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[var(--text-sm)] font-medium text-[var(--text-primary)]">Order #ORD-2026-1847</p>
          <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">Placed Apr 24, 2026</p>
        </div>
        <OrderStatusBadge status="SHIPPED" size="sm" />
      </div>
    </div>
  ),
}
