import type { Meta, StoryObj } from '@storybook/react'

import { StorefrontHeader } from './StorefrontHeader'

const meta = {
  title: 'layouts/StorefrontHeader',
  component: StorefrontHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontHeader>

export default meta
type Story = StoryObj<typeof StorefrontHeader>

const CATEGORIES = [
  { label: 'New Arrivals', href: '/new' },
  { label: 'Electronics', href: '/electronics' },
  { label: 'Clothing', href: '/clothing' },
  { label: 'Footwear', href: '/footwear' },
  { label: 'Home & Garden', href: '/home' },
  { label: 'Sports', href: '/sports' },
  { label: 'Sale', href: '/sale' },
]

export const Default: Story = {
  render: () => <StorefrontHeader onCartClick={() => console.log('Cart clicked')} categories={CATEGORIES} />,
}

export const WithCartItems: Story = {
  render: () => (
    <StorefrontHeader cartCount={3} wishlistCount={7} onCartClick={() => console.log('Cart')} categories={CATEGORIES} />
  ),
}

export const HighCounts: Story = {
  render: () => (
    <StorefrontHeader
      cartCount={42}
      wishlistCount={18}
      onCartClick={() => console.log('Cart')}
      categories={CATEGORIES}
    />
  ),
}

export const WithUser: Story = {
  render: () => (
    <StorefrontHeader
      user={{
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      }}
      cartCount={2}
      onCartClick={() => console.log('Cart')}
      categories={CATEGORIES}
    />
  ),
}

export const WithCustomLogo: Story = {
  render: () => (
    <StorefrontHeader
      logo={<span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>StyleShop</span>}
      cartCount={5}
      onCartClick={() => console.log('Cart')}
      categories={CATEGORIES}
    />
  ),
}

export const NoCategories: Story = {
  render: () => <StorefrontHeader cartCount={1} onCartClick={() => console.log('Cart')} />,
}

export const EmptyState: Story = {
  render: () => <StorefrontHeader onCartClick={() => console.log('Cart')} />,
}
