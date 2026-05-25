import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Notifications } from './Notifications'
import { notificationsDefaultProps } from './Notifications.fixtures'

const meta = {
  title: 'Pages/Notifications',
  component: Notifications,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Notifications>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...notificationsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Notifications {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...notificationsDefaultProps,
    items: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Notifications {...args} />
    </ConsoleLayout>
  ),
}
