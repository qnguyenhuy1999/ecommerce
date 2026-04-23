import type { Meta, StoryObj } from '@storybook/react'

import { OrderSummary } from './OrderSummary'

const meta: Meta<typeof OrderSummary> = {
  title: 'Molecules/OrderSummary',
  component: OrderSummary,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-sm mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof OrderSummary>

export const Default: Story = {
  args: {
    subtotal: 149.99,
    shipping: 'calculated',
    total: 149.99,
    onApplyPromo: (code) => alert(`Applied: ${code}`),
  },
}

export const FreeShipping: Story = {
  args: {
    subtotal: 149.99,
    shipping: 'free',
    tax: 10.5,
    total: 160.49,
    freeShippingThreshold: 100,
  },
}

export const WithDiscount: Story = {
  args: {
    subtotal: 249.99,
    shipping: 0,
    tax: 17.5,
    discount: { code: 'SAVE20', amount: 50.0 },
    total: 217.49,
    freeShippingThreshold: 200,
    onApplyPromo: (code) => alert(`Applied: ${code}`),
  },
}

export const PaidShipping: Story = {
  args: {
    subtotal: 59.99,
    shipping: 9.99,
    total: 69.98,
    freeShippingThreshold: 100,
    onApplyPromo: () => {},
    promoError: 'Invalid promo code. Please try again.',
  },
}
