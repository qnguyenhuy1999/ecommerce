import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from './ConsoleLayout'

const meta: Meta = {
  title: 'Layouts/ConsoleLayout',
  component: ConsoleLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ConsoleLayout>
      <div className="space-y-2 p-6">
        <h1 className="text-2xl font-semibold">Page Title</h1>
        <p className="text-muted-foreground text-sm">Page content is rendered inside ConsoleLayout.</p>
      </div>
    </ConsoleLayout>
  ),
}

export const WithNotifications: Story = {
  render: () => (
    <ConsoleLayout notificationCount={5}>
      <div className="space-y-2 p-6">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-muted-foreground text-sm">5 unread notifications in the sidebar badge.</p>
      </div>
    </ConsoleLayout>
  ),
}
