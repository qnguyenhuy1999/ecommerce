import type { Meta, StoryObj } from '@storybook/react-vite'
import { Notifications } from './Notifications'

const meta: Meta<typeof Notifications> = {
  title: 'pages/Notifications',
  component: Notifications,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Notifications>

export const Default: Story = {
  args: {
    notifications: [
      {
        id: 'n-1',
        title: 'Order shipped',
        message: 'Your order #abc123 has been shipped.',
        isRead: false,
        createdAtLabel: '1 hour ago',
      },
      {
        id: 'n-2',
        title: 'Order delivered',
        message: 'Your order #xyz789 has been delivered.',
        isRead: true,
        createdAtLabel: 'Yesterday',
      },
    ],
    loading: false,
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { notifications: [], loading: false },
}

export const AllRead: Story = {
  args: {
    notifications: [
      {
        id: 'n-1',
        title: 'Order shipped',
        message: 'Your order has been shipped.',
        isRead: true,
        createdAtLabel: '2 days ago',
      },
    ],
    loading: false,
  },
}
