import type { Meta } from '@storybook/react'

import { CartItem } from './CartItem'

const meta = {
  title: 'atoms/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CartItem>

export default meta

export const Default = {
  args: {
    id: 'item-1',
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    quantity: 2,
    image: 'https://picsum.photos/seed/headphones/200',
    onUpdateQuantity: () => {},
    onRemove: () => {},
  },
}

export const SingleQuantity = {
  args: {
    ...Default.args,
    quantity: 1,
  },
}

export const HighQuantity = {
  args: {
    ...Default.args,
    quantity: 10,
    price: 29.99,
  },
}

export const WithoutImage = {
  args: {
    ...Default.args,
    image: '',
  },
}

export const Interactive = {
  render: () => {
    let quantity = 2
    return (
      <div className="w-96 border rounded-lg p-4">
        <CartItem
          id="item-1"
          title="Wireless Bluetooth Headphones"
          price={89.99}
          quantity={quantity}
          image="https://picsum.photos/seed/headphones/200"
          onUpdateQuantity={(qty) => {
            quantity = qty
          }}
          onRemove={() => {}}
        />
      </div>
    )
  },
}
