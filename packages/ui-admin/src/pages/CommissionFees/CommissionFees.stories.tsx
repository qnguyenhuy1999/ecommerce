import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { CommissionFees } from './CommissionFees'
import { commissionFeesDefaultProps } from './CommissionFees.fixtures'

const meta = {
  title: 'Pages/CommissionFees',
  component: CommissionFees,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CommissionFees>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...commissionFeesDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <CommissionFees {...args} />
    </ConsoleLayout>
  ),
}
