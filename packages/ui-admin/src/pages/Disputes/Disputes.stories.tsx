import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Disputes } from './Disputes'
import { disputesDefaultProps } from './Disputes.fixtures'

const meta = {
  title: 'Pages/Disputes',
  component: Disputes,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Disputes>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...disputesDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Disputes {...args} />
    </ConsoleLayout>
  ),
}
