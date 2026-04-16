import type { Meta, StoryObj } from '@storybook/react'

import { StorefrontFooter } from './index'

const meta = {
  title: 'ui-storefront/layouts/StorefrontFooter',
  component: StorefrontFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontFooter>

export default meta
type Story = StoryObj<typeof StorefrontFooter>

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/new' },
      { label: 'Best Sellers', href: '/bestsellers' },
      { label: 'Sale', href: '/sale' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track Order', href: '/track' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

export const Default: Story = {
  render: () => (
    <StorefrontFooter
      logo={<span style={{ fontWeight: 800, fontSize: '1.25rem' }}>StyleShop</span>}
      description="Premium products curated for modern living. Quality you can trust, prices you'll love."
      showNewsletter={true}
      columns={COLUMNS}
      socials={[
        { platform: 'instagram' as const, href: 'https://instagram.com' },
        { platform: 'twitter' as const, href: 'https://twitter.com' },
        { platform: 'facebook' as const, href: 'https://facebook.com' },
        { platform: 'youtube' as const, href: 'https://youtube.com' },
      ]}
    />
  ),
}

export const WithLogo: Story = {
  render: () => (
    <StorefrontFooter
      logo={<span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--brand)' }}>BRAND</span>}
      description="Your go-to destination for premium lifestyle products."
      columns={COLUMNS.slice(0, 2)}
    />
  ),
}

export const WithoutNewsletter: Story = {
  render: () => (
    <StorefrontFooter
      logo={<span style={{ fontWeight: 800, fontSize: '1.25rem' }}>StyleShop</span>}
      description="Premium products for modern living."
      showNewsletter={false}
      columns={COLUMNS}
      socials={[
        { platform: 'instagram' as const, href: '#' },
        { platform: 'twitter' as const, href: '#' },
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
  render: () => (
    <StorefrontFooter
      logo={<span style={{ fontWeight: 800, fontSize: '1.25rem' }}>StyleShop</span>}
      description="Follow us for the latest drops and exclusive offers."
      columns={COLUMNS}
      socials={[
        { platform: 'instagram' as const, href: '#' },
        { platform: 'twitter' as const, href: '#' },
        { platform: 'facebook' as const, href: '#' },
        { platform: 'youtube' as const, href: '#' },
      ]}
    />
  ),
}
