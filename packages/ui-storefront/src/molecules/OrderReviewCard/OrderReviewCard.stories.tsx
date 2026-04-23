import type { Meta, StoryObj } from '@storybook/react'
import { CreditCard } from 'lucide-react'

import { OrderReviewCard } from './OrderReviewCard'

const ITEMS = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    quantity: 1,
  },
  {
    id: '2',
    title: 'USB-C Charging Cable (2m)',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    quantity: 2,
  },
]

const ADDRESS = {
  fullName: 'Jane Doe',
  phone: '+65 9123 4567',
  addressLine1: '123 Orchard Road',
  addressLine2: '#04-01',
  city: 'Singapore',
  postalCode: '238858',
  country: 'SG',
}

const meta: Meta<typeof OrderReviewCard> = {
  title: 'Molecules/OrderReviewCard',
  component: OrderReviewCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof OrderReviewCard>

export const Default: Story = {
  args: {
    shippingAddress: ADDRESS,
    paymentMethod: { label: 'Visa Credit Card', last4: '4242', icon: <CreditCard className="w-4 h-4" /> },
    items: ITEMS,
    totals: { subtotal: 169.97, shipping: 'free', tax: 11.9, total: 181.87 },
    onEdit: (section) => alert(`Edit: ${section}`),
  },
}

export const PaidShipping: Story = {
  args: {
    shippingAddress: ADDRESS,
    paymentMethod: { label: 'PayPal' },
    items: ITEMS,
    totals: { subtotal: 169.97, shipping: 9.99, total: 179.96 },
  },
}
