import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@ecom/ui'

import { Header, HeaderUserMenu } from './AdminHeader'

const meta: Meta<typeof Header> = {
  title: 'organisms/AdminHeader',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-[var(--story-container-min-height)] w-full bg-muted/30">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back, Admin',
  },
}

export const WithActions: Story = {
  render: (args) => <Header {...args} />,
  args: {
    title: 'Products',
    subtitle: 'Manage your product catalog',
    actions: (
      <>
        <Button variant="outline" size="sm">
          Import
        </Button>
        <Button size="sm">Add Product</Button>
      </>
    ),
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Orders',
    subtitle: '4,210 total orders · 8 pending',
  },
}

export const NoSubtitle: Story = {
  args: {
    title: 'Analytics',
  },
}

export const ManyActions: Story = {
  render: (args) => <Header {...args} />,
  args: {
    title: 'Customers',
    subtitle: '3,892 active customers',
    actions: (
      <>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button variant="outline" size="sm">
          Filter
        </Button>
        <Button size="sm">Add Customer</Button>
      </>
    ),
  },
}

export const WithUserMenu: Story = {
  render: (args) => <Header {...args} />,
  args: {
    title: 'Settings',
    actions: <HeaderUserMenu userName="Sarah Chen" userEmail="sarah@shop.com" />,
  },
}

export const WithNotificationsAndUser: Story = {
  render: (args) => <Header {...args} />,
  args: {
    title: 'Dashboard',
    subtitle: 'Overview of your store performance',
    actions: (
      <div className="flex items-center gap-4">
        <HeaderUserMenu userName="Marcus Johnson" userEmail="marcus@shop.com" />
      </div>
    ),
  },
}
