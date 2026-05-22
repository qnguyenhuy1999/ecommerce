import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { sellersKycDefaultProps } from './SellersKyc.fixtures'
import { SellersKyc } from './SellersKyc'

const meta = {
  title: 'Pages/SellersKyc',
  component: SellersKyc,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SellersKyc>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...sellersKycDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <SellersKyc {...args} />
    </ConsoleLayout>
  ),
}
