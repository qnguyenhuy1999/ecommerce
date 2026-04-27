import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { CartPageLayout } from './CartPageLayout'
import { CartList } from './components/CartList'
import { CartFooter } from './components/CartFooter'
import { OrderSummary } from '../../molecules/OrderSummary/OrderSummary'
import { Button } from '@ecom/ui'

const DEFAULT_ITEMS = [
  {
    id: 'sony-headphones',
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    variant: 'Black',
    originalPrice: 429.99,
    finalPrice: 349.99,
    quantity: 1,
  },
  {
    id: 'usb-c-cable',
    imageSrc: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop',
    title: 'USB-C Charging Cable 2m',
    variant: 'White / 2m',
    originalPrice: 19.99,
    finalPrice: 19.99,
    quantity: 2,
  },
  {
    id: 'samsung-watch',
    imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    title: 'Samsung Galaxy Watch 6 Classic',
    variant: '47mm / Black',
    originalPrice: 499.99,
    finalPrice: 449.99,
    quantity: 1,
  },
]

const meta: Meta<typeof CartPageLayout> = {
  title: 'Layouts/CartPageLayout',
  component: CartPageLayout,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof CartPageLayout>

function CartScreen({ initialItems }: { initialItems: typeof DEFAULT_ITEMS }) {
  const [items, setItems] = React.useState(initialItems)
  const [promoDiscount, setPromoDiscount] = React.useState(0)

  const subtotal = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
  const shipping = 'free'
  const tax = Number((subtotal * 0.08).toFixed(2))
  const shippingAmount = typeof shipping === 'number' ? shipping : 0
  const total = Number((subtotal + shippingAmount + tax - promoDiscount).toFixed(2))

  function handleQuantityChange(id: string, quantity: number) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleRemoveAll() {
    setItems([])
  }

  function handleApplyPromo(code: string) {
    setPromoDiscount(code.toUpperCase() === 'SAVE10' ? 10 : 0)
  }

  if (items.length === 0) {
    return (
      <CartPageLayout>
        <CartPageLayout.Items>
          <CartPageLayout.EmptyState />
        </CartPageLayout.Items>
      </CartPageLayout>
    )
  }

  return (
    <CartPageLayout>
      <CartPageLayout.Items>
        <CartList
          items={items}
          onItemQuantityChange={handleQuantityChange}
          onItemRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
        />
        <CartFooter />
      </CartPageLayout.Items>
      <CartPageLayout.Aside>
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          discount={{ code: 'SAVE50', amount: 50 }}
          total={total}
          freeShippingThreshold={500}
          onApplyPromo={handleApplyPromo}
        />
        <Button fullWidth size="lg">
          Proceed to Checkout →
        </Button>
      </CartPageLayout.Aside>
    </CartPageLayout>
  )
}

export const Default: Story = {
  render: () => <CartScreen initialItems={DEFAULT_ITEMS} />,
}

export const Empty: Story = {
  render: () => <CartScreen initialItems={[]} />,
}

export const Loading: Story = {
  render: () => (
    <CartPageLayout>
      <CartPageLayout.Loading />
    </CartPageLayout>
  ),
}
