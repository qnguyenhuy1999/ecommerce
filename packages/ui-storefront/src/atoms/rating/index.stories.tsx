import type { Meta, StoryObj } from '@storybook/react'
import { Rating } from './index'

const meta: Meta<typeof Rating> = {
  title: 'ui-storefront/atoms/Rating',
  component: Rating,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Rating>

export const FiveStars: Story = {
  args: {
    value: 5,
  },
}

export const FourHalfStars: Story = {
  args: {
    value: 4.5,
  },
}

export const FourStars: Story = {
  args: {
    value: 4,
  },
}

export const ThreeHalfStars: Story = {
  args: {
    value: 3.5,
  },
}

export const ThreeStars: Story = {
  args: {
    value: 3,
  },
}

export const TwoHalfStars: Story = {
  args: {
    value: 2.5,
  },
}

export const TwoStars: Story = {
  args: {
    value: 2,
  },
}

export const OneStar: Story = {
  args: {
    value: 1,
  },
}

export const ZeroStars: Story = {
  args: {
    value: 0,
  },
}

export const WithReviewCount: Story = {
  args: {
    value: 4.5,
    showCount: true,
    count: 1247,
  },
}

export const SmallSize: Story = {
  args: {
    value: 4,
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    value: 4.5,
    size: 'lg',
  },
}

export const SmallWithCount: Story = {
  args: {
    value: 3.5,
    size: 'sm',
    showCount: true,
    count: 89,
  },
}

export const LargeWithCount: Story = {
  args: {
    value: 4.8,
    size: 'lg',
    showCount: true,
    count: 3421,
  },
}

export const MaxRating: Story = {
  args: {
    value: 10,
    max: 10,
    showCount: true,
    count: 500,
  },
}