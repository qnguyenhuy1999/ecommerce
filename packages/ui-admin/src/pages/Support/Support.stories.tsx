import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { supportDefaultProps } from './Support.fixtures'
import { Support } from './Support'

const meta = {
  title: 'Pages/Support',
  component: Support,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Support>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...supportDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Support {...args} />
    </ConsoleLayout>
  ),
}

export const Loading: Story = {
  args: {
    ...supportDefaultProps,
    loadingTickets: true,
    loadingMessages: true,
  },
  render: (args) => (
    <ConsoleLayout>
      <Support {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...supportDefaultProps,
    tickets: [],
    messages: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Support {...args} />
    </ConsoleLayout>
  ),
}
