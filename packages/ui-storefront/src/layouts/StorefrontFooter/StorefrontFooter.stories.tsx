import type { Meta, StoryObj } from '@storybook/react'

import { StorefrontFooter } from './StorefrontFooter'
import { NewsletterSignup } from '../../organisms/NewsletterSignup/NewsletterSignup'
import { STOREFRONT_FOOTER_COLUMNS, STOREFRONT_FOOTER_WITH_SOCIALS_PROPS } from './StorefrontFooter.fixtures'

const meta = {
  title: 'layouts/StorefrontFooter',
  component: StorefrontFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontFooter>

export default meta
type Story = StoryObj<typeof StorefrontFooter>

export const Default: Story = {
  render: () => (
    <StorefrontFooter
      {...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS}
      description="Premium products curated for modern living. Quality you can trust, prices you'll love."
      newsletter={<NewsletterSignup />}
      socials={[
        { platform: 'instagram', href: 'https://instagram.com' },
        { platform: 'twitter', href: 'https://twitter.com' },
        { platform: 'facebook', href: 'https://facebook.com' },
        { platform: 'youtube', href: 'https://youtube.com' },
      ]}
    />
  ),
}

export const WithLogo: Story = {
  render: () => (
    <StorefrontFooter
      logo={<span className="text-2xl font-black tracking-tight text-brand">QHStore</span>}
      description="Your go-to destination for premium lifestyle products."
      columns={STOREFRONT_FOOTER_COLUMNS.slice(0, 2)}
    />
  ),
}

export const WithoutNewsletter: Story = {
  render: () => (
    <StorefrontFooter
      {...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS}
      description="Premium products for modern living."
      newsletter={undefined}
      socials={[
        { platform: 'instagram', href: '#' },
        { platform: 'twitter', href: '#' },
      ]}
    />
  ),
}

export const Minimal: Story = {
  render: () => (
    <StorefrontFooter
      columns={[
        {
          title: 'Quick Links',
          links: [
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      ]}
    />
  ),
}

export const WithSocials: Story = {
  render: () => <StorefrontFooter {...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS} />,
}
