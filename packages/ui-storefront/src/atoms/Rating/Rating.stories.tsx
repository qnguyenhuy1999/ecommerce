import type { Meta, StoryObj } from '@storybook/react'
import { Rating } from './Rating'

const meta: Meta<typeof Rating> = {
  title: 'atoms/Rating',
  component: Rating,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Rating>

export const FiveStars: Story = {
  args: { value: 5 },
}

export const FourHalfStars: Story = {
  args: { value: 4.5 },
}

export const WithReviewCount: Story = {
  args: { value: 4.5, showCount: true, count: 1247 },
}

export const SmallSize: Story = {
  args: { value: 4, size: 'sm' },
}

export const LargeSize: Story = {
  args: { value: 4.5, size: 'lg' },
}

export const MaxRating: Story = {
  args: { value: 10, max: 10, showCount: true, count: 500 },
}
