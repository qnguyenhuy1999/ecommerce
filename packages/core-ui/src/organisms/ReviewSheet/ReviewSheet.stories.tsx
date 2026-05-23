import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../atoms/Button'
import { ReviewSheet } from '.'

const meta: Meta<typeof ReviewSheet> = {
  title: 'organisms/ReviewSheet',
  component: ReviewSheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ReviewSheet>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <ReviewSheet
          open={open}
          onOpenChange={setOpen}
          title="Review order"
          subtitle="Check the details before approval."
          footer={<Button className="w-full">Approve review</Button>}>
          <div className="space-y-4 text-sm">
            <p>Order #1042</p>
            <p>Customer: Ava Chen</p>
            <p>Total: $128.00</p>
            <p>Review any notes, confirm the pricing, and approve when everything looks correct.</p>
          </div>
        </ReviewSheet>
      </>
    )
  },
}
