import type { Meta, StoryObj } from '@storybook/react'

import { WishlistPageLayout } from './WishlistPageLayout'

const PRODUCTS = [
  {
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
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    price: 349.99,
    originalPrice: 429.99,
    inStock: true,
    rating: 4.7,
    reviewCount: 2841,
    brand: 'Sony',
  },
  {
    id: '3',
    name: 'Samsung Galaxy Watch 6 Classic',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    price: 449.99,
    inStock: false,
    stockCount: 0,
    rating: 4.3,
    reviewCount: 156,
    brand: 'Samsung',
  },
  {
    id: '4',
    name: 'Adidas Ultraboost 22',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
    price: 189.99,
    originalPrice: 219.99,
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviewCount: 891,
    brand: 'Adidas',
  },
]

const meta: Meta<typeof WishlistPageLayout> = {
  title: 'Layouts/WishlistPageLayout',
  component: WishlistPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof WishlistPageLayout>

export const Default: Story = {
  args: {
    items: PRODUCTS.map((p) => ({
      product: p,
      onAddToCart: (id) => alert(`Add: ${id}`),
      onRemove: (id) => alert(`Remove: ${id}`),
      onViewProduct: (id) => alert(`View: ${id}`),
    })),
    onMoveAllToCart: () => alert('move all'),
    onSortChange: (v) => alert(`Sort: ${v}`),
  },
}

export const EmptyWishlist: Story = {
  args: {
    items: [],
  },
}
