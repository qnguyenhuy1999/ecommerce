import type { Meta, StoryObj } from '@storybook/react'
import { AddToCartButton } from './index'

const meta: Meta<typeof AddToCartButton> = {
  title: 'ui-storefront/atoms/AddToCartButton',
  component: AddToCartButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AddToCartButton>

export const Default: Story = {
  args: {
    label: 'Add to Cart',
    addedLabel: 'Added!',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Add',
    addedLabel: 'Added!',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Add to Cart',
    addedLabel: 'Added!',
  },
}

export const Loading: Story = {
  args: {
    state: 'loading',
    label: 'Add to Cart',
    addedLabel: 'Added!',
  },
}

export const Success: Story = {
  args: {
    state: 'success',
    label: 'Add to Cart',
    addedLabel: 'Added!',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Add to Cart',
    addedLabel: 'Added!',
    disabled: true,
  },
}

export const OutOfStock: Story = {
  render: () => (
    <AddToCartButton
      label="Out of Stock"
      disabled
      className="opacity-50 cursor-not-allowed"
    />
  ),
}

export const CustomLabel: Story = {
  args: {
    label: 'Buy Now',
    addedLabel: 'Purchased!',
  },
}