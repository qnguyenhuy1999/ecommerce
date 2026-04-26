'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { PromoBar, StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'

type StorefrontHeaderProps = React.ComponentProps<typeof StorefrontHeader>
type StorefrontFooterProps = React.ComponentProps<typeof StorefrontFooter>

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'EzMart'

/**
 * Module-level constants — referentially stable across every page render so
 * `useStorefrontChrome()` returns the same object identity from one navigation
 * to the next, avoiding wasted re-renders inside `HomePageLayout` /
 * `CollectionPageLayout` / `CartPageLayout`.
 */
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

const HEADER_CATEGORIES: NonNullable<StorefrontHeaderProps['categories']> = [
  { label: 'New', href: '/products?sort=newest' },
  { label: 'Best Sellers', href: '/products?sort=popular' },
  { label: 'Sale', href: '/products?onSale=true' },
]

const HEADER_LOGO = (
  <span className="text-xl font-black tracking-tight">{APP_NAME}</span>
)

const FOOTER_LOGO = (
  <span className="text-xl font-extrabold tracking-tight">{APP_NAME}</span>
)

const PROMO_BAR_NODE = (
  <PromoBar message="Free shipping on orders over $100" variant="brand" />
)

const FOOTER_PROPS_BASE: StorefrontFooterProps = {
  logo: FOOTER_LOGO,
  description:
    'Multi-vendor marketplace built with NestJS, Next.js, and PostgreSQL.',
  columns: FOOTER_COLUMNS,
  socials: FOOTER_SOCIALS,
}

/**
 * Centralised chrome props for every storefront page. Memoised against the
 * router so a navigation that doesn't change cart count doesn't re-render the
 * header subtree.
 */
export function useStorefrontChrome({ cartCount = 0 }: { cartCount?: number } = {}) {
  const router = useRouter()

  return React.useMemo(() => {
    const headerProps: StorefrontHeaderProps = {
      cartCount,
      wishlistCount: 0,
      logo: HEADER_LOGO,
      categories: HEADER_CATEGORIES,
      onCartClick: () => router.push('/cart'),
      onWishlistClick: () => router.push('/account/orders'),
      onLogin: () => router.push('/account/orders'),
    }
    return {
      promoBar: PROMO_BAR_NODE,
      headerProps,
      footerProps: FOOTER_PROPS_BASE,
    }
  }, [cartCount, router])
}
