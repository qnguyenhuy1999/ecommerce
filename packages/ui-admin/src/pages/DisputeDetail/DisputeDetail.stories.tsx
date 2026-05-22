import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { DisputeDetail } from './DisputeDetail'
import { disputeDetailDefaultProps } from './DisputeDetail.fixtures'

const meta = {
  title: 'Pages/DisputeDetail',
  component: DisputeDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DisputeDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...disputeDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <DisputeDetail {...args} />
    </ConsoleLayout>
  ),
}
