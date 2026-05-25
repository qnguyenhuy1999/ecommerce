import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Shipping } from './Shipping'
import { shippingDefaultProps } from './Shipping.fixtures'

const meta: Meta<typeof Shipping> = {
  title: 'Pages/Shipping',
  component: Shipping,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Shipping>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Shipping {...args} />
    </ConsoleLayout>
  ),
  args: { ...shippingDefaultProps },
}

export const Empty: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Shipping {...args} />
    </ConsoleLayout>
  ),
  args: { ...shippingDefaultProps, rows: [] },
}
