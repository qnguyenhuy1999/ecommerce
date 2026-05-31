import type { Meta, StoryObj } from '@storybook/react-vite'
import { Messages } from './Messages'
import { messagesDefaultProps } from './Messages.fixtures'

const meta = {
  title: 'Pages/Messages',
  component: Messages,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Messages>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...messagesDefaultProps,
    onSendMessage: async () => {},
    onSearchChange: () => {},
    onSelectedConversationChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    ...messagesDefaultProps,
    conversations: [],
    messages: [],
  },
}

export const Loading: Story = {
  args: {
    ...messagesDefaultProps,
    loadingConversations: true,
    loadingMessages: true,
  },
}
