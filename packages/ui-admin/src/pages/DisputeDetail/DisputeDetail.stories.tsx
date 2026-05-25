import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { RefundDetail } from './DisputeDetail'
import { refundDetailDefaultProps } from './DisputeDetail.fixtures'

const meta = {
  title: 'Pages/DisputeDetail',
  component: RefundDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RefundDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...refundDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <RefundDetail {...args} />
    </ConsoleLayout>
  ),
}
