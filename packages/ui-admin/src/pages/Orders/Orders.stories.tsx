import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Orders } from './Orders'
import { ordersDefaultProps } from './Orders.fixtures'

const meta = {
  title: 'Pages/Orders',
  component: Orders,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Orders>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...ordersDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Orders {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...ordersDefaultProps,
    items: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Orders {...args} />
    </ConsoleLayout>
  ),
}
