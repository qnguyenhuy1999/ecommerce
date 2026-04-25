import type { Meta, StoryObj } from '@storybook/react'

import { ProductBadge } from './Badge'

const meta: Meta<typeof ProductBadge> = {
  title: 'atoms/ProductBadge',
  component: ProductBadge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ProductBadge>

export const Default: Story = {
  args: {
    children: 'Featured',
  },
}

export const StorefrontVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ProductBadge variant="sale" />
      <ProductBadge variant="discount">-25%</ProductBadge>
      <ProductBadge variant="new" />
      <ProductBadge variant="limited" />
      <ProductBadge variant="out-of-stock" />
    </div>
  ),
}

export const CoreVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ProductBadge variant="success">Best Seller</ProductBadge>
      <ProductBadge variant="info">Free Shipping</ProductBadge>
      <ProductBadge variant="warning">Only 2 Left</ProductBadge>
      <ProductBadge variant="destructive">Ends Tonight</ProductBadge>
      <ProductBadge variant="outline">Pre-order</ProductBadge>
    </div>
  ),
}

export const OnProductCard: Story = {
  render: () => (
    <div className="w-72 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4 shadow-[var(--elevation-surface)]">
      <div className="mb-4 aspect-square rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
      <div className="mb-3 flex flex-wrap gap-2">
        <ProductBadge variant="sale" />
        <ProductBadge variant="new" />
      </div>
      <div className="space-y-1">
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">Running</p>
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--text-primary)]">AirFlex Everyday Sneaker</h3>
      </div>
    </div>
  ),
}
