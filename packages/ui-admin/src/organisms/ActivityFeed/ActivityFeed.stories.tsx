import type { Meta, StoryObj } from '@storybook/react'

import { ActivityFeed, type ActivityItem } from './ActivityFeed'

const meta: Meta<typeof ActivityFeed> = {
  title: 'organisms/ActivityFeed',
  component: ActivityFeed,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActivityFeed>

const SAMPLE_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/100?img=1' },
    action: 'created order',
    target: '#ORD-8847',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    user: { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/100?img=3' },
    action: 'updated product',
    target: 'Wireless Headphones Pro',
    timestamp: '15 minutes ago',
  },
  {
    id: '3',
    user: { name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/100?img=5' },
    action: 'processed refund for',
    target: '#ORD-8802',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    user: { name: 'David Kim', avatar: 'https://i.pravatar.cc/100?img=7' },
    action: 'added new category',
    target: 'Smart Home Devices',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    user: { name: 'Lisa Thompson', avatar: 'https://i.pravatar.cc/100?img=9' },
    action: 'approved review for',
    target: 'Mechanical Keyboard RGB',
    timestamp: '3 hours ago',
  },
  {
    id: '6',
    user: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/100?img=11' },
    action: 'shipped order',
    target: '#ORD-8839',
    timestamp: '5 hours ago',
  },
]

export const Default: Story = {
  args: {
    items: SAMPLE_ACTIVITY,
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}

export const MixedUsers: Story = {
  args: {
    items: SAMPLE_ACTIVITY.slice(0, 4),
  },
}

export const SingleItem: Story = {
  args: {
    items: [SAMPLE_ACTIVITY[0]],
  },
}
