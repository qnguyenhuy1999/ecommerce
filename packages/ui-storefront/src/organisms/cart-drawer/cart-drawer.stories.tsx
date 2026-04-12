import type { CartDrawerProps, CartItemData } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { Button } from '@ecom/ui'

import { CartDrawer } from './index'

const meta = {
  title: 'Organisms/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CartDrawer>

export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_ITEMS: CartItemData[] = [
  {
    id: 'item-1',
    name: 'Wireless Headphones',
    price: 89.99,
    quantity: 2,
    image: 'https://picsum.photos/seed/cd1/200',
  },
  {
    id: 'item-2',
    name: 'Mechanical Keyboard',
    price: 129.99,
    quantity: 1,
    image: 'https://picsum.photos/seed/cd2/200',
  },
  {
    id: 'item-3',
    name: 'USB-C Hub',
    price: 49.99,
    quantity: 3,
    image: 'https://picsum.photos/seed/cd3/200',
  },
]

export const Open = {
  render: () => {
    const [items, setItems] = useState<CartItemData[]>(SAMPLE_ITEMS)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return (
      <CartDrawer
        open
        onClose={() => {}}
        items={items}
        total={total}
        onCheckout={() => {}}
        onRemoveItem={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        onUpdateQuantity={() => {}}
      />
    )
  },
}

export const Empty = {
  render: () => <CartDrawer open onClose={() => {}} items={[]} total={0} onCheckout={() => {}} />,
}

export const SingleItem = {
  render: () => {
    const [items] = useState<CartItemData[]>([
      {
        id: 'item-1',
        name: 'Wireless Headphones',
        price: 89.99,
        quantity: 1,
        image: 'https://picsum.photos/seed/cd1/200',
      },
    ])
    return (
      <CartDrawer
        open
        onClose={() => {}}
        items={items}
        total={89.99}
        onCheckout={() => {}}
        onRemoveItem={() => {}}
        onUpdateQuantity={() => {}}
      />
    )
  },
}

export const Interactive = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<CartItemData[]>(SAMPLE_ITEMS)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Cart</Button>
        <CartDrawer
          open={open}
          onClose={() => setOpen(false)}
          items={items}
          total={total}
          onCheckout={() => setOpen(false)}
          onRemoveItem={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
          onUpdateQuantity={() => {}}
        />
      </>
    )
  },
}
