import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Refunds } from './Disputes'
import { refundsDefaultProps } from './Disputes.fixtures'

const meta = {
  title: 'Pages/Disputes',
  component: Refunds,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Refunds>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...refundsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Refunds {...args} />
    </ConsoleLayout>
  ),
}
