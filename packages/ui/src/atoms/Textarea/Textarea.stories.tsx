import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../../lib/shadcn/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Enter product description...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and multipoint Bluetooth for two devices simultaneously. Includes carrying case and detachable cable.',
    placeholder: 'Enter product description...',
  },
}

export const Error: Story = {
  args: {
    defaultValue: 'Invali',
    placeholder: 'Product description',
    'aria-invalid': true,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: 'This field is read-only because your account is not verified.',
    disabled: true,
  },
}

export const ProductReview: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <h3 className="text-sm font-semibold text-foreground">Write a Review</h3>
      <Textarea
        placeholder="Share your experience with this product. What did you like? What could be improved?"
        maxLength={500}
        className="min-h-[var(--space-16)]"
      />
      <p className="text-xs text-muted-foreground text-right">Be specific and honest to help other shoppers.</p>
    </div>
  ),
}

export const CustomerSupport: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-lg p-6 border rounded-[var(--radius-lg)]">
      <h3 className="text-sm font-semibold">Contact Support</h3>
      <Textarea
        placeholder="Describe your issue in detail. Include your order number if applicable."
        className="min-h-[var(--space-16)]"
        maxLength={1000}
      />
      <p className="text-xs text-muted-foreground">Our support team typically responds within 24 hours.</p>
    </div>
  ),
}
