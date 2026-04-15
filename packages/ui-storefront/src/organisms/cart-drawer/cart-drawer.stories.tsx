import type { Meta } from '@storybook/react'

import { useState } from 'react'

import { Button } from '@ecom/ui'

import { CartDrawer } from './index'
import type { CartItemData } from './index'

function useCartStories(initialItems: CartItemData[]) {
  const [items, setItems] = useState<CartItemData[]>(initialItems)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { items, subtotal, setItems }
}

const meta = {
  title: 'Organisms/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CartDrawer>

export default meta

const SAMPLE_ITEMS: CartItemData[] = [
  {
    id: 'item-1',
    title: 'Wireless Headphones',
    price: 89.99,
    quantity: 2,
    image: 'https://picsum.photos/seed/cd1/200',
  },
  {
    id: 'item-2',
    title: 'Mechanical Keyboard',
    price: 129.99,
    quantity: 1,
    image: 'https://picsum.photos/seed/cd2/200',
  },
  {
    id: 'item-3',
    title: 'USB-C Hub',
    price: 49.99,
    quantity: 3,
    image: 'https://picsum.photos/seed/cd3/200',
  },
]

function CartDrawerOpen() {
  const { items, subtotal, setItems } = useCartStories(SAMPLE_ITEMS)
  return (
    <CartDrawer
      open
      onOpenChange={() => {}}
      items={items}
      subtotal={subtotal}
      onCheckout={() => {}}
      onRemoveItem={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
      onUpdateQuantity={() => {}}
    />
  )
}

export const Open = {
  render: () => <CartDrawerOpen />,
}

export const Empty = {
  render: () => (
    <CartDrawer
      open
      onOpenChange={() => {}}
      items={[]}
      subtotal={0}
      onCheckout={() => {}}
    />
  ),
}

function CartDrawerSingle() {
  const { items } = useCartStories([
    {
      id: 'item-1',
      title: 'Wireless Headphones',
      price: 89.99,
      quantity: 1,
      image: 'https://picsum.photos/seed/cd1/200',
    },
  ])
  return (
    <CartDrawer
      open
      onOpenChange={() => {}}
      items={items}
      subtotal={89.99}
      onCheckout={() => {}}
      onRemoveItem={() => {}}
      onUpdateQuantity={() => {}}
    />
  )
}

export const SingleItem = {
  render: () => <CartDrawerSingle />,
}

function CartDrawerInteractive() {
  const [open, setOpen] = useState(false)
  const { items, subtotal, setItems } = useCartStories(SAMPLE_ITEMS)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Cart</Button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        subtotal={subtotal}
        onCheckout={() => setOpen(false)}
        onRemoveItem={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        onUpdateQuantity={() => {}}
      />
    </>
  )
}

export const Interactive = {
  render: () => <CartDrawerInteractive />,
}
