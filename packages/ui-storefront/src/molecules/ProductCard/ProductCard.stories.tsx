import type { Meta } from '@storybook/react'

import { Badge, Button } from '@ecom/ui'

import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
  ProductCardPrice,
  ProductCardActions,
  ProductCardSwatches,
} from './ProductCard'

const meta = {
  title: 'molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProductCard>

export default meta

const renderProductCard = (args: any) => (
  <div className="w-[300px]">
    <ProductCard id={args.id} title={args.title} loading={args.loading}>
      {args.image && <ProductCardImage src={args.image} alt={args.title} />}
      {args.badge && <ProductCardBadge>{args.badge}</ProductCardBadge>}
      <ProductCardContent>
        <ProductCardTitle />
        {args.colors && <ProductCardSwatches colors={args.colors} />}
        {args.price !== undefined && <ProductCardPrice price={args.price} originalPrice={args.originalPrice} />}
      </ProductCardContent>
      {args.onAddToCart && (
        <ProductCardActions>
          <Button size="sm" onClick={args.onAddToCart}>
            Add to Cart
          </Button>
        </ProductCardActions>
      )}
    </ProductCard>
  </div>
)

export const Default = {
  render: renderProductCard,
  args: {
    id: 'prod-1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    title: 'Premium Wireless Headphones',
    price: 149.99,
    colors: ['#000000', '#ffffff', '#e00b41'],
    onAddToCart: () => console.log('added'),
  },
}

export const WithOriginalPrice = {
  render: renderProductCard,
  args: {
    id: 'prod-2',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    title: 'Mechanical Keyboard with RGB Lighting',
    price: 79.99,
    originalPrice: 129.99,
    onAddToCart: () => console.log('added'),
  },
}

export const WithBadge = {
  render: renderProductCard,
  args: {
    id: 'prod-3',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    title: 'USB-C Hub 7-in-1',
    price: 49.99,
    badge: <Badge variant="destructive">Sale</Badge>,
    onAddToCart: () => console.log('added'),
  },
}

export const Loading = {
  render: renderProductCard,
  args: {
    id: 'loading',
    image: '',
    title: '',
    price: 0,
    loading: true,
  },
}

export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4">
      {renderProductCard({
        id: 'prod-1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        title: 'Premium Wireless Headphones',
        price: 149.99,
        onAddToCart: () => {},
      })}
      {renderProductCard({
        id: 'prod-2',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        title: 'Mechanical Keyboard',
        price: 79.99,
        originalPrice: 129.99,
        onAddToCart: () => {},
      })}
      {renderProductCard({
        id: 'prod-3',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
        title: 'USB-C Hub 7-in-1',
        price: 49.99,
        badge: <Badge variant="destructive">Sale</Badge>,
        onAddToCart: () => {},
      })}
    </div>
  ),
}
