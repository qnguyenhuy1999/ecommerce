import type { Meta, StoryObj } from '@storybook/react'

import { ProductGrid } from './index'
import type { Product } from './index'

const meta: Meta<typeof ProductGrid> = {
  title: 'ui-storefront/organisms/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductGrid>

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    badge: 'Best Seller',
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    title: 'Running Shoes Elite',
    price: 159.99,
    originalPrice: 199.99,
    badge: '30% Off',
  },
  {
    id: 'p3',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    title: 'Smart Fitness Watch Pro',
    price: 249.99,
    badge: 'New',
  },
  {
    id: 'p4',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    title: 'Premium Leather Crossbody Bag',
    price: 89.99,
    originalPrice: 129.99,
    badge: '30% Off',
  },
  {
    id: 'p5',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop',
    title: 'Ergonomic Office Chair',
    price: 349.99,
    badge: 'Best Seller',
  },
  {
    id: 'p6',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
    title: 'Canvas Sneakers Classic',
    price: 79.99,
    originalPrice: 99.99,
  },
  {
    id: 'p7',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    title: 'Minimal Desk Lamp',
    price: 59.99,
  },
  {
    id: 'p8',
    image: 'https://images.unsplash.com/photo-1605763240000-b7a0183d7d14?w=400&h=300&fit=crop',
    title: 'Organic Cotton Tote',
    price: 34.99,
    badge: 'New',
  },
]

const SALE_PRODUCTS: Product[] = PRODUCTS.slice(0, 4).map((p) => ({
  ...p,
  originalPrice: p.price + (p.price * 0.3),
}))

export const Default: Story = {
  args: {
    products: PRODUCTS,
  },
}

export const OnSale: Story = {
  args: {
    products: SALE_PRODUCTS,
  },
}

export const NewArrivals: Story = {
  args: {
    products: [
      { id: 'n1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', title: 'Smart Home Hub', price: 129.99, badge: 'New' },
      { id: 'n2', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', title: 'Trail Running Shoes', price: 179.99, badge: 'New' },
      { id: 'n3', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', title: 'Bluetooth Tracker', price: 29.99, badge: 'New' },
      { id: 'n4', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', title: 'Ceramic Plant Pot', price: 44.99, badge: 'New' },
    ],
  },
}

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    products: [],
    emptyMessage: 'No products match your search. Try adjusting your filters.',
  },
}

export const FewProducts: Story = {
  args: {
    products: PRODUCTS.slice(0, 3),
  },
}
