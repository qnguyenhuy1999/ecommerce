import type { Meta, StoryObj } from '@storybook/react'

import { HeroBanner } from './index'

const meta: Meta<typeof HeroBanner> = {
  title: 'ui-storefront/organisms/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HeroBanner>

export const Default: Story = {
  args: {
    title: 'Discover Your Style',
    subtitle: 'Explore our curated collection of premium products designed for modern living.',
    ctaLabel: 'Shop Now',
    ctaHref: '/shop',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w/1600&h=900&fit=crop',
    size: 'lg',
    align: 'center',
  },
}

export const LeftAligned: Story = {
  args: {
    title: 'Summer Collection 2026',
    subtitle: 'Breezy styles and vibrant colors to carry you through the season in comfort and confidence.',
    ctaLabel: 'Explore Collection',
    ctaHref: '/summer',
    backgroundImage: 'https://images.unsplash.com/photo-1505763240000-b7a0183d7d14?w/1600&h=900&fit=crop',
    size: 'md',
    align: 'left',
  },
}

export const RightAligned: Story = {
  args: {
    title: 'Up to 50% Off',
    subtitle: 'Our biggest sale of the year is here. Limited time only.',
    ctaLabel: 'Shop the Sale',
    ctaHref: '/sale',
    backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w/1600&h=900&fit=crop',
    size: 'md',
    align: 'right',
  },
}

export const SmallSize: Story = {
  args: {
    title: 'New Arrivals This Week',
    subtitle: 'Fresh styles just landed.',
    ctaLabel: 'See Whats New',
    ctaHref: '/new',
    backgroundImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w/1600&h=600&fit=crop',
    size: 'sm',
  },
}

export const FullScreen: Story = {
  args: {
    title: 'Welcome to Our Store',
    subtitle: 'Premium products, curated for you.',
    ctaLabel: 'Start Shopping',
    ctaHref: '/all',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w/1920&h=1080&fit=crop',
    size: 'full',
    align: 'center',
  },
}

export const WithoutOverlay: Story = {
  args: {
    title: 'Minimal & Clean',
    subtitle: 'When the image says it all.',
    ctaLabel: 'View Products',
    ctaHref: '/products',
    backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w/1600&h=900&fit=crop',
    overlay: false,
    size: 'lg',
  },
}

export const NoCta: Story = {
  args: {
    title: 'The Art of Living Well',
    subtitle: 'Curated collections for a life well-lived.',
    backgroundImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w/1600&h=900&fit=crop',
    size: 'lg',
  },
}

export const SaleBanner: Story = {
  args: {
    title: 'Black Friday Deals',
    subtitle: 'Save up to 70% on electronics, fashion, home goods, and more. Shop now before they are gone.',
    ctaLabel: 'Shop Black Friday',
    ctaHref: '/black-friday',
    backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w/1600&h=900&fit=crop',
    size: 'md',
    align: 'center',
  },
}
