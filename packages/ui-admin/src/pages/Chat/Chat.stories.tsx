import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Chat } from './Chat'
import { chatDefaultProps } from './Chat.fixtures'

const meta = {
  title: 'Pages/Chat',
  component: Chat,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Chat>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...chatDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Chat {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    conversations: [],
    messages: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Chat {...args} />
    </ConsoleLayout>
  ),
}
