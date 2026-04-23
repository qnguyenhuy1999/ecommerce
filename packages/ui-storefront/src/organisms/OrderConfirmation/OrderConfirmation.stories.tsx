import type { Meta, StoryObj } from '@storybook/react'

import { OrderConfirmation } from './OrderConfirmation'

const ITEMS = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Headphones',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    quantity: 1,
  },
  {
    id: '2',
    title: 'USB-C Cable (2m)',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    quantity: 2,
  },
]

const meta: Meta<typeof OrderConfirmation> = {
  title: 'Organisms/OrderConfirmation',
  component: OrderConfirmation,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof OrderConfirmation>

export const Default: Story = {
  args: {
    orderNumber: 'ORD-20240423-001',
    email: 'jane@example.com',
    estimatedDelivery: 'Apr 26 – Apr 28, 2024',
    items: ITEMS,
    totals: { subtotal: 389.97, shipping: 'free', tax: 27.3, total: 417.27 },
    onContinueShopping: () => alert('continue'),
    onTrackOrder: () => alert('track'),
  },
}

export const WithPaidShipping: Story = {
  args: {
    orderNumber: 'ORD-20240423-002',
    email: 'john@example.com',
    items: ITEMS.slice(0, 1),
    totals: { subtotal: 349.99, shipping: 9.99, total: 359.98 },
    onContinueShopping: () => alert('continue'),
  },
}
