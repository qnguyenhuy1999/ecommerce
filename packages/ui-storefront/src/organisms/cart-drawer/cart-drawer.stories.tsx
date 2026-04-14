import { useState } from 'react'

import type { Meta } from '@storybook/react'


import { Button } from '@ecom/ui'

import { CartDrawer } from './index'
import type { CartItemData } from './types'

function useCartStories(initialItems: CartItemData[]) {
  const [items, setItems] = useState<CartItemData[]>(initialItems)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { items, total, setItems }
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

function CartDrawerOpen() {
  const { items, total, setItems } = useCartStories(SAMPLE_ITEMS)
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
}

export const Open = {
  render: () => <CartDrawerOpen />,
}

export const Empty = {
  render: () => <CartDrawer open onClose={() => {}} items={[]} total={0} onCheckout={() => {}} />,
}

function CartDrawerSingle() {
  const { items } = useCartStories([
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
}

export const SingleItem = {
  render: () => <CartDrawerSingle />,
}

function CartDrawerInteractive() {
  const [open, setOpen] = useState(false)
  const { items, total, setItems } = useCartStories(SAMPLE_ITEMS)
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
}

export const Interactive = {
  render: () => <CartDrawerInteractive />,
}
