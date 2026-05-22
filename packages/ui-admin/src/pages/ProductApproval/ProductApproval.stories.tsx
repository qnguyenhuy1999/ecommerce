import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { ProductApproval } from './ProductApproval'
import { productApprovalDefaultProps } from './ProductApproval.fixtures'

const meta = {
  title: 'Pages/ProductApproval',
  component: ProductApproval,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProductApproval>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...productApprovalDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <ProductApproval {...args} />
    </ConsoleLayout>
  ),
}
