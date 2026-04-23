import type { Meta, StoryObj } from '@storybook/react'

import { WishlistCard } from './WishlistCard'

const PRODUCT = {
  id: '1',
  name: 'Nike Air Max 270 React',
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  price: 149.99,
  originalPrice: 189.99,
  inStock: true,
  stockCount: 5,
  rating: 4.5,
  reviewCount: 312,
  brand: 'Nike',
}

const meta: Meta<typeof WishlistCard> = {
  title: 'Molecules/WishlistCard',
  component: WishlistCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-xs mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof WishlistCard>

export const Default: Story = {
  args: {
    product: PRODUCT,
    onAddToCart: (id) => alert(`Add to cart: ${id}`),
    onRemove: (id) => alert(`Remove: ${id}`),
    onViewProduct: (id) => alert(`View: ${id}`),
  },
}

export const OutOfStock: Story = {
  args: {
    product: { ...PRODUCT, inStock: false, stockCount: 0 },
    onRemove: (id) => alert(`Remove: ${id}`),
    onViewProduct: (id) => alert(`View: ${id}`),
  },
}

export const NoOriginalPrice: Story = {
  args: {
    product: { ...PRODUCT, originalPrice: undefined, brand: undefined },
    onAddToCart: (id) => alert(`Add to cart: ${id}`),
    onRemove: (id) => alert(`Remove: ${id}`),
  },
}
