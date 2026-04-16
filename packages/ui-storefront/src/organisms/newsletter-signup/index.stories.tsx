import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { NewsletterSignup } from './index'

const meta: Meta<typeof NewsletterSignup> = {
  title: 'ui-storefront/organisms/NewsletterSignup',
  component: NewsletterSignup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NewsletterSignup>

export const Default: Story = {
  args: {},
}

export const CustomTitleAndDescription: Story = {
  args: {
    title: 'Get 15% Off Your First Order',
    description: 'Subscribe to our newsletter and receive an exclusive discount code straight to your inbox.',
    placeholder: 'Enter your email address',
  },
}

export const WithSubscribeHandler: Story = {
  args: {
    title: 'Stay in the Loop',
    description: 'Be the first to know about new arrivals, exclusive offers, and style inspiration.',
    onSubscribe: async (email: string) => {
      console.log('Subscribed:', email)
      await new Promise((r) => setTimeout(r, 1000))
    },
  },
}

export const SuccessState: Story = {
  render: () => (
    <div className="p-8 bg-muted">
      <NewsletterSignup
        title="Join Our Newsletter"
        description="Get the latest updates on new products and upcoming sales."
        onSubscribe={async () => {
          await new Promise((r) => setTimeout(r, 1000))
        }}
      />
    </div>
  ),
}

export const Minimal: Story = {
  args: {
    title: 'Subscribe for Updates',
    description: 'No spam, just the good stuff.',
    placeholder: 'Your email',
  },
}

export const EcommerceStyle: Story = {
  args: {
    title: 'Get Early Access to Sales',
    description: 'Join 50,000+ shoppers who never miss a deal.',
    placeholder: 'Email address',
    onSubscribe: async (email: string) => {
      console.log('Newsletter signup:', email)
    },
  },
}
