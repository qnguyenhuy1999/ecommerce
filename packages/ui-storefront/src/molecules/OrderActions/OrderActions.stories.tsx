import type { Meta, StoryObj } from '@storybook/react'

import { OrderActions } from './OrderActions'

const meta: Meta<typeof OrderActions> = {
  title: 'Molecules/OrderActions',
  component: OrderActions,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[400px] border border-[var(--border-subtle)] p-4 rounded-xl bg-[var(--surface-base)]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OrderActions>

export const Processing: Story = {
  args: {
    status: 'PROCESSING',
    onCancel: () => alert('Cancel order'),
    onChangeAddress: () => alert('Change address'),
  },
}

export const Shipped: Story = {
  args: {
    status: 'SHIPPED',
    onTrack: () => alert('Track order'),
  },
}

export const CompletedWithReview: Story = {
  args: {
    status: 'COMPLETED',
    onReorder: () => alert('Buy again'),
    onWriteReview: () => alert('Write review'),
  },
}

export const CompletedWithInvoice: Story = {
  args: {
    status: 'COMPLETED',
    onReorder: () => alert('Buy again'),
    onDownloadInvoice: () => alert('Download invoice'),
  },
}

export const Cancelled: Story = {
  args: {
    status: 'CANCELLED',
    onReorder: () => alert('Reorder'),
  },
}
