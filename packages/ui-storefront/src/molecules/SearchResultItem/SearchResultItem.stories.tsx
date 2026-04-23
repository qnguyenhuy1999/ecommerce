import type { Meta, StoryObj } from '@storybook/react'

import { SearchResultItem } from './SearchResultItem'

const PRODUCT = {
  id: '1',
  name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  price: 349.99,
  originalPrice: 429.99,
  rating: 4.7,
  reviewCount: 2841,
  brand: 'Sony',
  inStock: true,
}

const meta: Meta<typeof SearchResultItem> = {
  title: 'Molecules/SearchResultItem',
  component: SearchResultItem,
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

type Story = StoryObj<typeof SearchResultItem>

export const Default: Story = {
  args: {
    product: PRODUCT,
    query: 'wireless headphones',
    onQuickAdd: (id) => alert(`Add to cart: ${id}`),
    onWishlist: (id) => alert(`Wishlist: ${id}`),
    onView: (id) => alert(`View: ${id}`),
  },
}

export const OutOfStock: Story = {
  args: {
    product: { ...PRODUCT, inStock: false },
    query: 'sony',
    onView: (id) => alert(`View: ${id}`),
  },
}

export const NoRating: Story = {
  args: {
    product: { ...PRODUCT, rating: undefined, reviewCount: undefined, brand: undefined },
    onQuickAdd: (id) => alert(`Add: ${id}`),
  },
}
