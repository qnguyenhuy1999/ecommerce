'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { PromoBar, StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

type StorefrontHeaderProps = React.ComponentProps<typeof StorefrontHeader>
type StorefrontFooterProps = React.ComponentProps<typeof StorefrontFooter>

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'EzMart'

const FOOTER_COLUMNS: NonNullable<StorefrontFooterProps['columns']> = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'Sale', href: '/products?onSale=true' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track Order', href: '/account/orders' },
      { label: 'Returns', href: '/account/orders' },
      { label: 'Shipping Info', href: '/account/orders' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
]

const FOOTER_SOCIALS: NonNullable<StorefrontFooterProps['socials']> = [
  { platform: 'instagram', href: '#' },
  { platform: 'twitter', href: '#' },
  { platform: 'facebook', href: '#' },
  { platform: 'youtube', href: '#' },
]

/**
 * Shared chrome bits for the storefront pages. Each layout in
 * `@ecom/ui-storefront` accepts header / footer / promoBar slots — we wire
 * them up here so every page presents a consistent look without duplicating
 * literal markup.
 */
export function useStorefrontChrome(cartCount = 0): {
  promoBar: React.ReactNode
  headerProps: StorefrontHeaderProps
  footerProps: StorefrontFooterProps
} {
  const router = useRouter()

  const headerProps: StorefrontHeaderProps = {
    cartCount,
    wishlistCount: 0,
    logo: <span className="text-xl font-black tracking-tight">{APP_NAME}</span>,
    categories: [
      { label: 'New', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'Sale', href: '/products?onSale=true' },
    ],
    onCartClick: () => router.push('/cart'),
    onWishlistClick: () => router.push('/account/orders'),
    onLogin: () => router.push('/account/orders'),
  }

  return {
    promoBar: <PromoBar message="Free shipping on orders over $100" variant="brand" />,
    headerProps,
    footerProps: {
      logo: <span className="text-xl font-extrabold tracking-tight">{APP_NAME}</span>,
      description:
        'Multi-vendor marketplace built with NestJS, Next.js, and PostgreSQL.',
      columns: FOOTER_COLUMNS,
      socials: FOOTER_SOCIALS,
    },
  }
}
