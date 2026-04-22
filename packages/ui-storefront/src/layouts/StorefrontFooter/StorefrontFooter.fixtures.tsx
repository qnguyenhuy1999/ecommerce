import type { StorefrontFooterProps } from './StorefrontFooter'

export const STOREFRONT_FOOTER_COLUMNS: NonNullable<StorefrontFooterProps['columns']> = [
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

export const STOREFRONT_FOOTER_SOCIALS: NonNullable<StorefrontFooterProps['socials']> = [
  { platform: 'instagram', href: '#' },
  { platform: 'twitter', href: '#' },
  { platform: 'facebook', href: '#' },
  { platform: 'youtube', href: '#' },
]

export const STOREFRONT_FOOTER_WITH_SOCIALS_PROPS: Pick<
  StorefrontFooterProps,
  'logo' | 'description' | 'columns' | 'socials'
> = {
  logo: <span className="text-xl font-extrabold tracking-tight">QHStore</span>,
  description: 'Follow us for the latest drops and exclusive offers.',
  columns: STOREFRONT_FOOTER_COLUMNS,
  socials: STOREFRONT_FOOTER_SOCIALS,
}
