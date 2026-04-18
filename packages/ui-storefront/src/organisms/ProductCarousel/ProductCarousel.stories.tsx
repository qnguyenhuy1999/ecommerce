import type { Meta, StoryObj } from '@storybook/react'

import { ProductCarousel } from './ProductCarousel'
import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
  ProductCardRating,
  ProductCardPrice,
} from '../../molecules/ProductCard/ProductCard'

const meta: Meta<typeof ProductCarousel> = {
  title: 'organisms/ProductCarousel',
  component: ProductCarousel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductCarousel>

function makeCard(
  id: string,
  title: string,
  image: string,
  price: number,
  originalPrice?: number,
  badge?: string,
  rating?: number,
  count?: number,
) {
  return (
    <ProductCard id={id} title={title}>
      <ProductCardImage src={image} alt={title} />
      {badge && <ProductCardBadge>{badge}</ProductCardBadge>}
      <ProductCardContent>
        <ProductCardTitle />
        {rating !== undefined && <ProductCardRating value={rating} count={count} />}
        <ProductCardPrice price={price} originalPrice={originalPrice} />
      </ProductCardContent>
    </ProductCard>
  )
}

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

const PRODUCTS = [
  makeCard('p1', 'Wireless Headphones', PRODUCT_IMAGES[0], 299.99, undefined, 'Best Seller', 4.7, 12843),
  makeCard('p2', 'Running Shoes Elite', PRODUCT_IMAGES[1], 159.99, 199.99, '30% Off', 4.4, 3201),
  makeCard('p3', 'Smart Fitness Watch', PRODUCT_IMAGES[2], 249.99, undefined, 'New', 4.8, 89),
  makeCard('p4', 'Leather Crossbody Bag', PRODUCT_IMAGES[3], 89.99, 129.99, '30% Off', 4.2, 412),
  makeCard('p5', 'Ergonomic Office Chair', PRODUCT_IMAGES[4], 349.99, undefined, 'Best Seller', 4.6, 14238),
  makeCard('p6', 'Canvas Sneakers', PRODUCT_IMAGES[5], 79.99, 99.99, undefined, 4.3, 892),
  makeCard('p7', 'Minimal Desk Lamp', PRODUCT_IMAGES[6], 59.99, undefined, undefined, 4.5, 1247),
  makeCard('p8', 'Linen Tote Bag', PRODUCT_IMAGES[7], 34.99, undefined, 'New', 4.1, 203),
]

export const Default: Story = {
  render: () => (
    <div>
      <ProductCarousel title="Featured Products" viewAllHref="/featured" products={PRODUCTS} />
    </div>
  ),
}

export const NewArrivals: Story = {
  render: () => (
    <div>
      <ProductCarousel title="New Arrivals" viewAllHref="/new" products={PRODUCTS.slice(2, 6)} />
    </div>
  ),
}

export const BestSellers: Story = {
  render: () => (
    <div>
      <ProductCarousel title="Best Sellers" viewAllHref="/bestsellers" products={PRODUCTS.slice(0, 5)} />
    </div>
  ),
}

export const OnSale: Story = {
  render: () => (
    <div>
      <ProductCarousel title="On Sale Now" viewAllHref="/sale" products={PRODUCTS.slice(1, 7)} />
    </div>
  ),
}

export const WithoutViewAll: Story = {
  render: () => (
    <div>
      <ProductCarousel title="You May Also Like" products={PRODUCTS.slice(0, 4)} />
    </div>
  ),
}

export const SmallSet: Story = {
  render: () => (
    <div>
      <ProductCarousel title="Trending This Week" products={PRODUCTS.slice(0, 3)} />
    </div>
  ),
}
