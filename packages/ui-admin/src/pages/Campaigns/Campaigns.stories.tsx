import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Campaigns } from './Campaigns'
import { campaignsDefaultProps } from './Campaigns.fixtures'

const meta = {
  title: 'Pages/Campaigns',
  component: Campaigns,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Campaigns>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...campaignsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Campaigns {...args} />
    </ConsoleLayout>
  ),
}
