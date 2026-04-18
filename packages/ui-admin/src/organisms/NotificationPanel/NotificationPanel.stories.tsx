import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { NotificationPanel, type NotificationItem } from './NotificationPanel'

const meta: Meta<typeof NotificationPanel> = {
  title: 'organisms/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NotificationPanel>

const ALL_UNREAD: NotificationItem[] = [
  {
    id: '1',
    title: 'New order received',
    message: 'Order #ORD-8847 — $149.99 from Sarah Chen.',
    read: false,
    timestamp: '2 min ago',
    type: 'order',
  },
  {
    id: '2',
    title: 'Payment confirmed',
    message: 'Invoice #INV-2024-0142 paid successfully.',
    read: false,
    timestamp: '18 min ago',
    type: 'success',
  },
  {
    id: '3',
    title: 'Low stock alert',
    message: 'USB-C Hub 7-Port has only 3 units remaining.',
    read: false,
    timestamp: '45 min ago',
    type: 'warning',
  },
  {
    id: '4',
    title: 'New review posted',
    message: 'Lisa Thompson reviewed "Mechanical Keyboard RGB" — 5 stars.',
    read: false,
    timestamp: '1h ago',
    type: 'info',
  },
]

const MIXED_READ: NotificationItem[] = [
  {
    id: '5',
    title: 'Return requested',
    message: 'Customer #C-8812 requested a return for order #ORD-8802.',
    read: false,
    timestamp: '1h ago',
    type: 'order',
  },
  {
    id: '6',
    title: 'Webhook failure',
    message: 'Payment gateway webhook failed 3 times. Retry needed.',
    read: false,
    timestamp: '3h ago',
    type: 'error',
  },
  {
    id: '7',
    title: 'Product approved',
    message: 'Wireless Headphones Pro has been approved and published.',
    read: true,
    timestamp: 'Yesterday',
    type: 'success',
  },
  {
    id: '8',
    title: 'Discount expiring',
    message: 'Spring Sale 20% off ends in 2 days.',
    read: true,
    timestamp: 'Yesterday',
    type: 'info',
  },
]

function InteractiveNotificationPanel() {
  const [notifications, setNotifications] = React.useState(ALL_UNREAD)
  return (
    <div className="p-8 flex justify-end">
      <NotificationPanel
        notifications={notifications}
        onMarkRead={(id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <InteractiveNotificationPanel />,
}

export const AllUnread: Story = {
  render: () => (
    <div className="p-8 flex justify-end">
      <NotificationPanel notifications={ALL_UNREAD} />
    </div>
  ),
}

export const MixedReadStatus: Story = {
  render: () => (
    <div className="p-8 flex justify-end">
      <NotificationPanel notifications={MIXED_READ} />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="p-8 flex justify-end">
      <NotificationPanel notifications={[]} />
    </div>
  ),
}
