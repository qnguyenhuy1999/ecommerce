import type { Meta, StoryObj } from '@storybook/react'
import { CartItem } from './index'
import type { CartItemProps } from './types'

const meta = {
  title: 'Atoms/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CartItem>

export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_ITEM: CartItemProps['item'] = {
  id: 'item-1',
  name: 'Wireless Bluetooth Headphones',
  price: 89.99,
  quantity: 2,
  image: 'https://picsum.photos/seed/headphones/200',
}

export const Default = {
  args: {
    item: SAMPLE_ITEM,
    onQuantityChange: () => {},
    onRemove: () => {},
  },
}

export const SingleQuantity = {
  args: {
    item: { ...SAMPLE_ITEM, quantity: 1 },
    onQuantityChange: () => {},
    onRemove: () => {},
  },
}

export const HighQuantity = {
  args: {
    item: { ...SAMPLE_ITEM, quantity: 10, price: 29.99 },
    onQuantityChange: () => {},
    onRemove: () => {},
  },
}

export const WithoutImage = {
  args: {
    item: { ...SAMPLE_ITEM, image: undefined },
    onQuantityChange: () => {},
    onRemove: () => {},
  },
}

export const Interactive = {
  render: () => {
    let quantity = 2
    return (
      <div className="w-96 border rounded-lg p-4">
        <CartItem
          item={{ ...SAMPLE_ITEM, quantity }}
          onQuantityChange={(qty) => {
            quantity = qty
          }}
          onRemove={() => {}}
        />
      </div>
    )
  },
}
