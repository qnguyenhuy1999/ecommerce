import type { Meta, StoryObj } from '@storybook/react'

import { ReviewCard } from './index'

const meta: Meta<typeof ReviewCard> = {
  title: 'ui-storefront/molecules/ReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ReviewCard>

export const Default: Story = {
  args: {
    author: 'Sarah Mitchell',
    rating: 5,
    date: 'April 12, 2026',
    content:
      'Absolutely love this product! The quality exceeded my expectations and it arrived much faster than I anticipated. Highly recommend to anyone looking for something reliable.',
  },
}

export const FiveStars: Story = {
  args: {
    author: 'James Thompson',
    rating: 5,
    date: 'April 10, 2026',
    content:
      'Best purchase I have made this year. The design is sleek, the performance is outstanding, and the customer service was excellent when I had a question.',
    verified: true,
  },
}

export const FourStars: Story = {
  args: {
    author: 'Emily Rodriguez',
    rating: 4,
    date: 'April 8, 2026',
    content:
      'Great product overall. Takes a bit of time to get used to, but once you do, it works beautifully. Minor drawback is the setup process could be simpler.',
    verified: true,
  },
}

export const ThreeStars: Story = {
  args: {
    author: 'Michael Chen',
    rating: 3,
    date: 'April 5, 2026',
    content:
      'Decent product for the price. Does what it says, but I expected a bit more given the brand reputation. Not bad, not exceptional.',
  },
}

export const VerifiedBuyer: Story = {
  args: {
    author: 'Amanda Foster',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    date: 'April 3, 2026',
    content:
      'Perfect fit exactly as described. Shipping was fast and packaging was secure. Will definitely be ordering again.',
    verified: true,
  },
}

export const WithAvatar: Story = {
  args: {
    author: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    date: 'April 1, 2026',
    content:
      'Solid product. Does the job well. The only reason for 4 stars instead of 5 is that it could use a few more features, but for the price it is hard to beat.',
  },
}

export const ShortReview: Story = {
  args: {
    author: 'Lisa Park',
    rating: 5,
    date: 'March 28, 2026',
    content: 'Exactly what I needed. Could not be happier!',
    verified: true,
  },
}

export const CriticalReview: Story = {
  args: {
    author: 'Robert Walsh',
    rating: 2,
    date: 'March 25, 2026',
    content:
      'The product looks different from the photos and the quality feels cheaper than expected. Disappointed given the price point. Hopefully the brand improves in future versions.',
  },
}
