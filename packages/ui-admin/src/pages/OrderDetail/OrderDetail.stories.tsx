import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { OrderDetail } from './OrderDetail'
import { orderDetailDefaultProps } from './OrderDetail.fixtures'

const meta = {
  title: 'Pages/OrderDetail',
  component: OrderDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OrderDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...orderDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <OrderDetail {...args} />
    </ConsoleLayout>
  ),
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <ConsoleLayout>
      <OrderDetail {...args} />
    </ConsoleLayout>
  ),
}

export const NotFound: Story = {
  args: {
    loading: false,
  },
  render: (args) => (
    <ConsoleLayout>
      <OrderDetail {...args} />
    </ConsoleLayout>
  ),
}
