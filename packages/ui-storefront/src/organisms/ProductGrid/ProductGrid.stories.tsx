import type { Meta } from '@storybook/react'

import { Badge } from '@ecom/ui-storefront'

import { ProductGrid } from './ProductGrid'
import type { Product } from './types'

const meta = {
  title: 'organisms/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProductGrid>

export default meta

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/pg1/400/400',
    title: 'Wireless Headphones',
    price: 89.99,
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/pg2/400/400',
    title: 'Mechanical Keyboard',
    price: 129.99,
    originalPrice: 159.99,
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/pg3/400/400',
    title: 'USB-C Hub',
    price: 49.99,
    badge: <Badge variant="destructive">Sale</Badge>,
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/pg4/400/400',
    title: 'Monitor Stand',
    price: 34.99,
  },
  { id: '5', image: 'https://picsum.photos/seed/pg5/400/400', title: 'Webcam HD', price: 59.99 },
  { id: '6', image: 'https://picsum.photos/seed/pg6/400/400', title: 'Desk Lamp', price: 24.99 },
]

export const Default = {
  args: {
    products: SAMPLE_PRODUCTS,
    onAddToCart: () => {},
  },
}

export const Empty = {
  args: {
    products: [],
    emptyMessage: 'No products match your filters.',
    onAddToCart: () => {},
  },
}

export const Loading = {
  args: {
    products: [],
    loading: true,
    onAddToCart: () => {},
  },
}

export const FewProducts = {
  args: {
    products: SAMPLE_PRODUCTS.slice(0, 2),
    onAddToCart: () => {},
  },
}
