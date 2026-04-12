import type { Meta, StoryObj } from '@storybook/react'

import { StorefrontHeader } from './index'

const meta = {
  title: 'Layouts/StorefrontHeader',
  component: StorefrontHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    cartCount: 0,
    onCartClick: () => {},
  },
}

export const WithItemsInCart = {
  args: {
    cartCount: 3,
    onCartClick: () => {},
  },
}

export const HighCartCount = {
  args: {
    cartCount: 150,
    onCartClick: () => {},
  },
}

export const CustomLogo = {
  args: {
    cartCount: 5,
    onCartClick: () => {},
    logo: <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>MyShop</span>,
  },
}
