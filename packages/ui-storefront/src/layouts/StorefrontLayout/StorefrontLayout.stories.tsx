import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from '@ecom/core-ui'
import { StorefrontLayout } from './StorefrontLayout'

const meta: Meta<typeof StorefrontLayout> = {
  title: 'layouts/StorefrontLayout',
  component: StorefrontLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof StorefrontLayout>

export const Default: Story = {
  render: () => (
    <StorefrontLayout>
      <StorefrontLayout.Content>
        <div className="bg-card rounded-2xl border p-10">
          <Typography variant="h3">Page content slot</Typography>
        </div>
      </StorefrontLayout.Content>
    </StorefrontLayout>
  ),
}
