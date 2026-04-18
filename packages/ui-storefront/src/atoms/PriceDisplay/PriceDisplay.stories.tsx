import type { Meta, StoryObj } from '@storybook/react'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'atoms/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PriceDisplay>

export const RegularPrice: Story = {
  args: {
    price: 299.0,
  },
}

export const SalePrice: Story = {
  args: {
    price: 199.0,
    originalPrice: 349.99,
  },
}

export const SmallSize: Story = {
  args: {
    price: 79.99,
    size: 'sm',
  },
}

export const SmallSale: Story = {
  args: {
    price: 49.99,
    originalPrice: 89.99,
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    price: 1299.0,
    size: 'lg',
  },
}

export const LargeSale: Story = {
  args: {
    price: 899.0,
    originalPrice: 1199.0,
    size: 'lg',
  },
}

export const EuroCurrency: Story = {
  args: {
    price: 79.99,
    currency: 'EUR',
    size: 'default',
  },
}

export const HighDiscount: Story = {
  args: {
    price: 19.99,
    originalPrice: 99.99,
  },
}

export const ZeroDecimal: Story = {
  args: {
    price: 100.0,
    originalPrice: 150.0,
  },
}
