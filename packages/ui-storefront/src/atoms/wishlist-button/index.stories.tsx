import type { Meta, StoryObj } from '@storybook/react'

import { WishlistButton } from './index'

const meta: Meta<typeof WishlistButton> = {
  title: 'ui-storefront/atoms/WishlistButton',
  component: WishlistButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof WishlistButton>

export const Default: Story = {
  args: {},
}

export const Wishlisted: Story = {
  args: {
    wishlisted: true,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const SmallWishlisted: Story = {
  args: {
    size: 'sm',
    wishlisted: true,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const LargeWishlisted: Story = {
  args: {
    size: 'lg',
    wishlisted: true,
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <WishlistButton size="sm" />
      <WishlistButton size="sm" wishlisted />
      <WishlistButton size="default" />
      <WishlistButton size="default" wishlisted />
      <WishlistButton size="lg" />
      <WishlistButton size="lg" wishlisted />
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    onToggle: (wishlisted: boolean) => {
      console.log('Wishlist toggled:', wishlisted)
    },
  },
}

export const Controlled: Story = {
  args: {
    wishlisted: false,
    onToggle: (wishlisted: boolean) => {
      console.log('Controlled toggle:', wishlisted)
    },
  },
}
