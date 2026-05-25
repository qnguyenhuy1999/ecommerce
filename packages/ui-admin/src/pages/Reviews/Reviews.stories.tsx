import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Reviews } from './Reviews'
import { reviewsDefaultProps } from './Reviews.fixtures'

const meta = {
  title: 'Pages/Reviews',
  component: Reviews,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Reviews>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...reviewsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Reviews {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...reviewsDefaultProps,
    items: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Reviews {...args} />
    </ConsoleLayout>
  ),
}
