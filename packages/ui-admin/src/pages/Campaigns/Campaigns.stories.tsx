import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Vouchers } from './Campaigns'
import { vouchersDefaultProps } from './Campaigns.fixtures'

const meta = {
  title: 'Pages/Campaigns',
  component: Vouchers,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Vouchers>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...vouchersDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Vouchers {...args} />
    </ConsoleLayout>
  ),
}
