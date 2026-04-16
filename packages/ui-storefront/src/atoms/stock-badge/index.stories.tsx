import type { Meta, StoryObj } from '@storybook/react'
import { StockBadge } from './index'

const meta: Meta<typeof StockBadge> = {
  title: 'ui-storefront/atoms/StockBadge',
  component: StockBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StockBadge>

export const InStock: Story = {
  args: {
    status: 'in-stock',
  },
}

export const InStockLarge: Story = {
  args: {
    status: 'in-stock',
    count: 50,
  },
}

export const LowStock: Story = {
  args: {
    status: 'low-stock',
    count: 3,
  },
}

export const LowStock5: Story = {
  args: {
    status: 'low-stock',
    count: 5,
  },
}

export const LowStock10: Story = {
  args: {
    status: 'low-stock',
    count: 10,
  },
}

export const LowStock20: Story = {
  args: {
    status: 'low-stock',
    count: 20,
  },
}

export const OutOfStock: Story = {
  args: {
    status: 'out-of-stock',
  },
}