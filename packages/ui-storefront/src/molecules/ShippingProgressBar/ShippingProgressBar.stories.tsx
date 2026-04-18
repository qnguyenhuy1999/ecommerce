import type { Meta, StoryObj } from '@storybook/react'

import { ShippingProgressBar } from './ShippingProgressBar'

const meta: Meta<typeof ShippingProgressBar> = {
  title: 'molecules/ShippingProgressBar',
  component: ShippingProgressBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ShippingProgressBar>

export const Default: Story = {
  args: {
    current: 45,
    threshold: 100,
  },
}

export const AlmostThere: Story = {
  args: {
    current: 85,
    threshold: 100,
  },
}

export const Unlocked: Story = {
  args: {
    current: 120,
    threshold: 100,
  },
}

export const JustStarted: Story = {
  args: {
    current: 15,
    threshold: 100,
  },
}

export const Halfway: Story = {
  args: {
    current: 50,
    threshold: 100,
  },
}

export const HighThreshold: Story = {
  args: {
    current: 150,
    threshold: 200,
  },
}

export const Zero: Story = {
  args: {
    current: 0,
    threshold: 100,
  },
}

export const CustomCurrency: Story = {
  args: {
    current: 35,
    threshold: 100,
    currency: 'USD',
  },
}
