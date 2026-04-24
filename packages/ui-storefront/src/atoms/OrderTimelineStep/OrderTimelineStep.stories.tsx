import type { Meta, StoryObj } from '@storybook/react'
import { Clock3, Package, Truck } from 'lucide-react'

import { OrderTimelineStep } from './OrderTimelineStep'

const meta: Meta<typeof OrderTimelineStep> = {
  title: 'atoms/OrderTimelineStep',
  component: OrderTimelineStep,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OrderTimelineStep>

export const Complete: Story = {
  args: {
    label: 'Order placed',
    date: 'Apr 24, 10:32 AM',
    description: 'We received your order and started processing it.',
    status: 'complete',
    isLast: true,
  },
}

export const Current: Story = {
  args: {
    label: 'Preparing shipment',
    date: 'Apr 24, 1:10 PM',
    description: 'Your items are packed and ready to leave the warehouse.',
    status: 'current',
    icon: <Package className="h-3.5 w-3.5" />,
    isLast: true,
  },
}

export const Pending: Story = {
  args: {
    label: 'Out for delivery',
    description: 'Estimated delivery by tomorrow evening.',
    status: 'pending',
    isLast: true,
  },
}

export const TimelineSequence: Story = {
  render: () => (
    <div>
      <OrderTimelineStep
        label="Order placed"
        date="Apr 24, 10:32 AM"
        description="Payment was authorized successfully."
        status="complete"
        icon={<Clock3 className="h-3.5 w-3.5" />}
      />
      <OrderTimelineStep
        label="Packed and ready"
        date="Apr 24, 2:18 PM"
        description="Your parcel has been handed to the courier."
        status="current"
        icon={<Package className="h-3.5 w-3.5" />}
      />
      <OrderTimelineStep
        label="Delivered"
        description="Expected between Apr 25 - Apr 26."
        status="pending"
        icon={<Truck className="h-3.5 w-3.5" />}
        isLast
      />
    </div>
  ),
}
