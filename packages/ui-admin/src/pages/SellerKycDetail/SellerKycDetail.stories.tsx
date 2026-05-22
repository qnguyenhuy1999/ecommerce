import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { sellerKycDetailDefaultProps } from './SellerKycDetail.fixtures'
import { SellerKycDetail } from './SellerKycDetail'

const meta = {
  title: 'Pages/SellerKycDetail',
  component: SellerKycDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SellerKycDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...sellerKycDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <SellerKycDetail {...args} />
    </ConsoleLayout>
  ),
}
