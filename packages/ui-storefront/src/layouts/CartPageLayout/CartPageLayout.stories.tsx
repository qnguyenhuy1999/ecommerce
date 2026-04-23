import type { Meta, StoryObj } from '@storybook/react'

import { CartPageLayout } from './CartPageLayout'

const ITEMS = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    price: 349.99,
    originalPrice: 429.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    quantity: 1,
    variant: 'Black',
  },
  {
    id: '2',
    title: 'USB-C Charging Cable 2m',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    quantity: 2,
  },
  {
    id: '3',
    title: 'Samsung Galaxy Watch 6 Classic',
    price: 449.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    quantity: 1,
    variant: '47mm / Black',
  },
]

const meta: Meta<typeof CartPageLayout> = {
  title: 'Layouts/CartPageLayout',
  component: CartPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof CartPageLayout>

export const Default: Story = {
  args: {
    items: ITEMS,
    subtotal: 839.96,
    shipping: 'free',
    tax: 58.8,
    total: 898.76,
    freeShippingThreshold: 500,
    onCheckout: () => alert('checkout'),
    onUpdateQuantity: (id, qty) => console.log('update', id, qty),
    onRemoveItem: (id) => console.log('remove', id),
    onApplyPromo: (code) => alert(`Promo: ${code}`),
  },
}

export const EmptyCart: Story = {
  args: {
    items: [],
    subtotal: 0,
    shipping: 'calculated',
    total: 0,
  },
}

export const WithDiscount: Story = {
  args: {
    items: ITEMS,
    subtotal: 839.96,
    shipping: 'free',
    tax: 58.8,
    discount: { code: 'SAVE50', amount: 50 },
    total: 848.76,
    onCheckout: () => alert('checkout'),
  },
}
