import type { Meta, StoryObj } from '@storybook/react'

import type { WishlistCardAccent } from '../../molecules/WishlistCard/WishlistCard'

import { WishlistPageLayout } from './WishlistPageLayout'

const ACCENTS: WishlistCardAccent[] = ['mist', 'sand', 'sage', 'rose', 'subtle', 'muted']

const PRODUCTS = [
  {
    id: '1',
    name: 'Nike Air Max 270 React',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
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
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
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
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',
    secondaryImage: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600',
    price: 189.99,
    originalPrice: 219.99,
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviewCount: 891,
    brand: 'Adidas',
  },
]

const SIDEBAR = {
  user: {
    name: 'Sophie Tran',
    email: 'sophie.tran@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128',
  },
  activeItem: 'wishlist',
  onItemClick: (id: string) => alert(`Nav: ${id}`),
  onLogout: () => alert('Sign out'),
}

const meta: Meta<typeof WishlistPageLayout> = {
  title: 'Layouts/WishlistPageLayout',
  component: WishlistPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof WishlistPageLayout>

export const Dashboard: Story = {
  args: {
    sidebarProps: SIDEBAR,
    items: PRODUCTS.map((p, i) => ({
      product: p,
      accent: ACCENTS[i % ACCENTS.length],
      onAddToCart: (id) => alert(`Add: ${id}`),
      onRemove: (id) => alert(`Remove: ${id}`),
      onNotify: (id) => alert(`Notify me: ${id}`),
      onViewProduct: (id) => alert(`View: ${id}`),
    })),
    onMoveAllToCart: () => alert('Move all to cart'),
    onShareWishlist: () => alert('Share wishlist'),
    onSortChange: (v) => alert(`Sort: ${v}`),
  },
}

export const EmptyWishlist: Story = {
  args: {
    sidebarProps: SIDEBAR,
    items: [],
    onExploreProducts: () => alert('Explore products'),
  },
}
