import type { Meta, StoryObj } from '@storybook/react'

import { OrderTimeline, type TimelineStep } from './OrderTimeline'

const meta: Meta<typeof OrderTimeline> = {
  title: 'molecules/OrderTimeline',
  component: OrderTimeline,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof OrderTimeline>

const ORDER_STEPS: TimelineStep[] = [
  {
    label: 'Order Placed',
    description: 'Order #ORD-2024-8847 confirmed.',
    timestamp: 'Apr 12, 10:32 AM',
    status: 'completed',
  },
  {
    label: 'Payment Verified',
    description: 'Payment of $149.99 processed.',
    timestamp: 'Apr 12, 10:35 AM',
    status: 'completed',
  },
  {
    label: 'Processing',
    description: 'Items are being picked and packed.',
    timestamp: 'Apr 12, 2:15 PM',
    status: 'completed',
  },
  {
    label: 'Shipped',
    description: 'Shipped via FedEx - Tracking: 7489201837462.',
    timestamp: 'Apr 13, 9:00 AM',
    status: 'current',
  },
  { label: 'Delivered', status: 'upcoming' },
]

const RETURN_STEPS: TimelineStep[] = [
  { label: 'Return Initiated', timestamp: 'Apr 14, 3:22 PM', status: 'completed' },
  { label: 'Item Received', timestamp: 'Apr 16, 11:00 AM', status: 'completed' },
  {
    label: 'Refund Processed',
    description: 'Refund of $89.99 issued to original payment method.',
    timestamp: 'Apr 17, 2:30 PM',
    status: 'current',
  },
  { label: 'Completed', status: 'upcoming' },
]

const FAILED_STEPS: TimelineStep[] = [
  { label: 'Order Placed', status: 'completed' },
  {
    label: 'Payment Failed',
    description: 'Card declined. Please update payment method.',
    timestamp: 'Apr 12, 10:35 AM',
    status: 'error',
  },
  { label: 'Cancelled', status: 'upcoming' },
]

export const Default: Story = {
  args: {
    steps: ORDER_STEPS,
  },
}

export const ActiveOrder: Story = {
  args: {
    steps: ORDER_STEPS,
  },
}

export const ReturnProcess: Story = {
  args: {
    steps: RETURN_STEPS,
  },
}

export const FailedOrder: Story = {
  args: {
    steps: FAILED_STEPS,
  },
}

export const CompletedOrder: Story = {
  args: {
    steps: [
      { label: 'Order Placed', timestamp: 'Apr 10, 8:00 AM', status: 'completed' },
      { label: 'Payment Verified', timestamp: 'Apr 10, 8:05 AM', status: 'completed' },
      { label: 'Processing', timestamp: 'Apr 10, 11:30 AM', status: 'completed' },
      { label: 'Shipped', timestamp: 'Apr 11, 2:00 PM', status: 'completed' },
      { label: 'Delivered', timestamp: 'Apr 13, 10:15 AM', status: 'completed' },
    ],
  },
}

export const PendingOrder: Story = {
  args: {
    steps: [
      {
        label: 'Order Placed',
        description: 'Awaiting payment confirmation.',
        timestamp: 'Apr 17, 9:00 AM',
        status: 'current',
      },
      { label: 'Payment Verified', status: 'upcoming' },
      { label: 'Processing', status: 'upcoming' },
      { label: 'Shipped', status: 'upcoming' },
      { label: 'Delivered', status: 'upcoming' },
    ],
  },
}
