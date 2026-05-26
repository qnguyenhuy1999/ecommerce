import type { Meta, StoryObj } from '@storybook/react-vite'
import { Messages } from './Messages'

const meta: Meta<typeof Messages> = {
  title: 'pages/Messages',
  component: Messages,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Messages>

export const Default: Story = {
  args: {
    conversations: [
      { id: 'conv-1', shopIdShort: 'abc123', lastMessageText: 'Is this still available?', unreadCount: 2 },
      { id: 'conv-2', shopIdShort: 'def456', lastMessageText: null, unreadCount: 0 },
    ],
    messages: [
      { id: 'msg-1', content: 'Is this still available?', createdAtLabel: '2 hours ago' },
      { id: 'msg-2', content: 'Yes, it is!', createdAtLabel: '1 hour ago' },
    ],
    selectedConversationId: 'conv-1',
    draft: '',
    newShopId: '',
    newProductId: '',
    loading: false,
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { conversations: [], messages: [], loading: false },
}
