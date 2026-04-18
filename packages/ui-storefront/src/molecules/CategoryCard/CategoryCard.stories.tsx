import type { Meta, StoryObj } from '@storybook/react'

import { CategoryCard } from './CategoryCard'

const meta: Meta<typeof CategoryCard> = {
  title: 'molecules/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CategoryCard>

export const Default: Story = {
  args: {
    title: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    href: '/category/electronics',
    itemCount: 124,
  },
}

export const WithoutItemCount: Story = {
  args: {
    title: 'Summer Collection',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    href: '/category/summer',
  },
}

export const Footwear: Story = {
  args: {
    title: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    href: '/category/footwear',
    itemCount: 89,
  },
}

export const Apparel: Story = {
  args: {
    title: 'Apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop',
    href: '/category/apparel',
    itemCount: 342,
  },
}

export const Accessories: Story = {
  args: {
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff08b?w=600&h=400&fit=crop',
    href: '/category/accessories',
    itemCount: 215,
  },
}

export const Kitchen: Story = {
  args: {
    title: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
    href: '/category/kitchen',
    itemCount: 178,
  },
}

export const Sports: Story = {
  args: {
    title: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1461896836934- voices?w=600&h=400&fit=crop',
    href: '/category/sports',
    itemCount: 94,
  },
}

export const SingleItem: Story = {
  args: {
    title: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    href: '/new',
    itemCount: 12,
  },
}
