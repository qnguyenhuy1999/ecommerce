import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Notifications } from './Notifications'
import { notificationsDefaultProps } from './Notifications.fixtures'

const meta: Meta<typeof Notifications> = {
  title: 'Pages/Notifications',
  component: Notifications,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Notifications>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Notifications {...args} />
    </ConsoleLayout>
  ),
  args: { ...notificationsDefaultProps },
}

export const UnreadOnly: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Notifications {...args} />
    </ConsoleLayout>
  ),
  args: { ...notificationsDefaultProps, unreadOnly: true },
}
