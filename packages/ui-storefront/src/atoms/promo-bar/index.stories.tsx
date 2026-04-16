import type { Meta, StoryObj } from '@storybook/react'
import { PromoBar } from './index'

const meta: Meta<typeof PromoBar> = {
  title: 'ui-storefront/atoms/PromoBar',
  component: PromoBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PromoBar>

export const Brand: Story = {
  args: {
    message: 'Summer Sale — Up to 50% off everything. Limited time only!',
    variant: 'brand',
  },
}

export const BrandWithLink: Story = {
  args: {
    message: 'Free shipping on all orders over $50 — Shop Now',
    link: '/sale',
    variant: 'brand',
  },
}

export const Info: Story = {
  args: {
    message: 'New collection dropping this Friday — Stay tuned!',
    variant: 'info',
  },
}

export const Success: Story = {
  args: {
    message: 'Order today & receive your package by Saturday!',
    variant: 'success',
  },
}

export const Dark: Story = {
  args: {
    message: 'Exclusive members-only deals — Log in to unlock your discount.',
    variant: 'dark',
  },
}

export const Dismissible: Story = {
  args: {
    message: 'Flash Sale: 24 hours only — 30% off sitewide',
    variant: 'brand',
    dismissible: true,
  },
}

export const DismissibleWithLink: Story = {
  args: {
    message: 'Buy 2 Get 1 Free on all accessories — Limited stock!',
    link: '/offers',
    variant: 'success',
    dismissible: true,
  },
}