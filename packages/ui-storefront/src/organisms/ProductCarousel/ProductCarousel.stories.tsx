import type { Meta, StoryObj } from '@storybook/react'

import { ProductCarousel } from './ProductCarousel'
import type { Product } from '../ProductGrid/ProductGrid'

const meta: Meta<typeof ProductCarousel> = {
  title: 'organisms/ProductCarousel',
  component: ProductCarousel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductCarousel>

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1605763240000-b7a0183d7d14?w=400&h=300&fit=crop',
]

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Wireless Headphones',
    image: PRODUCT_IMAGES[0],
    price: 299.99,
    badge: 'Best Seller',
    rating: 4.7,
    ratingCount: 12843,
    buyCount: 42001,
  },
  {
    id: 'p2',
    title: 'Running Shoes Elite',
    image: PRODUCT_IMAGES[1],
    price: 159.99,
    originalPrice: 199.99,
    badge: '30% Off',
    rating: 4.4,
    ratingCount: 3201,
    buyCount: 18120,
  },
  {
    id: 'p3',
    title: 'Smart Fitness Watch',
    image: PRODUCT_IMAGES[2],
    price: 249.99,
    badge: 'New',
    rating: 4.8,
    ratingCount: 89,
    buyCount: 2140,
  },
  {
    id: 'p4',
    title: 'Leather Crossbody Bag',
    image: PRODUCT_IMAGES[3],
    price: 89.99,
    originalPrice: 129.99,
    badge: '30% Off',
    rating: 4.2,
    ratingCount: 412,
    buyCount: 6900,
  },
  {
    id: 'p5',
    title: 'Ergonomic Office Chair',
    image: PRODUCT_IMAGES[4],
    price: 349.99,
    badge: 'Best Seller',
    rating: 4.6,
    ratingCount: 14238,
    buyCount: 9034,
  },
  {
    id: 'p6',
    title: 'Canvas Sneakers',
    image: PRODUCT_IMAGES[5],
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.3,
    ratingCount: 892,
    buyCount: 24450,
  },
  {
    id: 'p7',
    title: 'Minimal Desk Lamp',
    image: PRODUCT_IMAGES[6],
    price: 59.99,
    rating: 4.5,
    ratingCount: 1247,
    buyCount: 16400,
  },
  {
    id: 'p8',
    title: 'Linen Tote Bag',
    image: PRODUCT_IMAGES[7],
    price: 34.99,
    badge: 'New',
    rating: 4.1,
    ratingCount: 203,
    buyCount: 5200,
  },
]

export const Default: Story = {
  render: () => (
    <div>
      <ProductCarousel title="Featured Products" viewAllHref="/featured" products={PRODUCTS} onAddToCart={() => {}} />
    </div>
  ),
}

export const NewArrivals: Story = {
  render: () => (
    <div>
      <ProductCarousel title="New Arrivals" viewAllHref="/new" products={PRODUCTS.slice(2, 6)} onAddToCart={() => {}} />
    </div>
  ),
}

export const BestSellers: Story = {
  render: () => (
    <div>
      <ProductCarousel
        title="Best Sellers"
        viewAllHref="/bestsellers"
        products={PRODUCTS.slice(0, 5)}
        onAddToCart={() => {}}
      />
    </div>
  ),
}

export const OnSale: Story = {
  render: () => (
    <div>
      <ProductCarousel title="On Sale Now" viewAllHref="/sale" products={PRODUCTS.slice(1, 7)} onAddToCart={() => {}} />
    </div>
  ),
}

export const WithoutViewAll: Story = {
  render: () => (
    <div>
      <ProductCarousel title="You May Also Like" products={PRODUCTS.slice(0, 4)} onAddToCart={() => {}} />
    </div>
  ),
}

export const SmallSet: Story = {
  render: () => (
    <div>
      <ProductCarousel title="Trending This Week" products={PRODUCTS.slice(0, 3)} onAddToCart={() => {}} />
    </div>
  ),
}
