import type { Meta, StoryObj } from '@storybook/react'

import { CategoryGrid } from './index'

const meta: Meta<typeof CategoryGrid> = {
  title: 'ui-storefront/organisms/CategoryGrid',
  component: CategoryGrid,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CategoryGrid>

const CATEGORIES = [
  {
    title: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    href: '/category/electronics',
    itemCount: 284,
  },
  {
    title: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    href: '/category/footwear',
    itemCount: 189,
  },
  {
    title: 'Apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop',
    href: '/category/apparel',
    itemCount: 512,
  },
  {
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff08b?w=600&h=400&fit=crop',
    href: '/category/accessories',
    itemCount: 215,
  },
  {
    title: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
    href: '/category/home',
    itemCount: 178,
  },
  {
    title: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
    href: '/category/sports',
    itemCount: 94,
  },
]

export const Default: Story = {
  args: {
    categories: CATEGORIES,
    columns: 3,
  },
}

export const TwoColumns: Story = {
  args: {
    categories: CATEGORIES,
    columns: 2,
  },
}

export const FourColumns: Story = {
  args: {
    categories: CATEGORIES,
    columns: 4,
  },
}

export const WithoutItemCount: Story = {
  args: {
    categories: CATEGORIES.map((c) => ({ ...c, itemCount: undefined })),
    columns: 3,
  },
}

export const FeaturedFour: Story = {
  args: {
    categories: [
      {
        title: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
        href: '/new',
        itemCount: 48,
      },
      {
        title: 'Best Sellers',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
        href: '/bestsellers',
        itemCount: 124,
      },
      {
        title: 'Summer Sale',
        image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=600&h=400&fit=crop',
        href: '/sale',
        itemCount: 89,
      },
      {
        title: 'Gift Guide',
        image: 'https://images.unsplash.com/photo-1513116476489-7635e79fee00?w=600&h=400&fit=crop',
        href: '/gifts',
        itemCount: 67,
      },
    ],
    columns: 4,
  },
}
