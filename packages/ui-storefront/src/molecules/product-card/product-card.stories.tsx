import type { Meta } from '@storybook/react'

import { Badge } from '@ecom/ui'

import { ProductCard } from './index'

const meta = {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProductCard>

export default meta

export const Default = {
  args: {
    id: 'prod-1',
    image: 'https://picsum.photos/seed/prod1/400/400',
    title: 'Premium Wireless Headphones',
    price: 149.99,
    onAddToCart: () => {},
  },
}

export const WithOriginalPrice = {
  args: {
    id: 'prod-2',
    image: 'https://picsum.photos/seed/prod2/400/400',
    title: 'Mechanical Keyboard with RGB Lighting',
    price: 79.99,
    originalPrice: 129.99,
    onAddToCart: () => {},
  },
}

export const WithBadge = {
  args: {
    id: 'prod-3',
    image: 'https://picsum.photos/seed/prod3/400/400',
    title: 'USB-C Hub 7-in-1',
    price: 49.99,
    badge: <Badge variant="destructive">Sale</Badge>,
    onAddToCart: () => {},
  },
}

export const Loading = {
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
      <ProductCard
        id="prod-1"
        image="https://picsum.photos/seed/prod1/400/400"
        title="Premium Wireless Headphones"
        price={149.99}
        onAddToCart={() => {}}
      />
      <ProductCard
        id="prod-2"
        image="https://picsum.photos/seed/prod2/400/400"
        title="Mechanical Keyboard"
        price={79.99}
        originalPrice={129.99}
        onAddToCart={() => {}}
      />
      <ProductCard
        id="prod-3"
        image="https://picsum.photos/seed/prod3/400/400"
        title="USB-C Hub 7-in-1"
        price={49.99}
        badge={<Badge variant="destructive">Sale</Badge>}
        onAddToCart={() => {}}
      />
    </div>
  ),
}
