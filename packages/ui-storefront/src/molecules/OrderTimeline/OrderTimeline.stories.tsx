import type { Meta, StoryObj } from '@storybook/react'

import { OrderTimeline } from './OrderTimeline'

const COMPLETE_STEPS = [
  {
    id: '1',
    label: 'Order Placed',
    description: 'Your order has been received',
    date: 'Apr 20, 10:32 AM',
    status: 'complete' as const,
  },
  {
    id: '2',
    label: 'Payment Confirmed',
    description: 'Payment successfully processed',
    date: 'Apr 20, 10:35 AM',
    status: 'complete' as const,
  },
  {
    id: '3',
    label: 'Processing',
    description: 'Your order is being prepared',
    date: 'Apr 21, 09:00 AM',
    status: 'current' as const,
  },
  { id: '4', label: 'Shipped', description: 'Your order is on its way', status: 'pending' as const },
  { id: '5', label: 'Delivered', description: 'Estimated delivery Apr 24–26', status: 'pending' as const },
]

const meta: Meta<typeof OrderTimeline> = {
  title: 'Molecules/OrderTimeline',
  component: OrderTimeline,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof OrderTimeline>

export const Processing: Story = {
  args: { steps: COMPLETE_STEPS },
}

export const Shipped: Story = {
  args: {
    steps: COMPLETE_STEPS.map((s, i) => (i < 4 ? { ...s, status: 'complete' as const } : s)),
    trackingInfo: {
      carrier: 'SingPost',
      trackingNumber: 'SP123456789SG',
      trackingUrl: 'https://singpost.com',
    },
  },
}

export const Completed: Story = {
  args: {
    steps: COMPLETE_STEPS.map((s) => ({ ...s, status: 'complete' as const })),
  },
}
