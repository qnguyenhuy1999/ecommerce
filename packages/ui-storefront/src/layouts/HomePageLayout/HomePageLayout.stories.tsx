import type { Meta } from '@storybook/react'

import { PromoBar } from '../../atoms/PromoBar/PromoBar'
import { NewsletterSignup } from '../../organisms/NewsletterSignup/NewsletterSignup'
import { HeroBanner } from '../../organisms/HeroBanner/HeroBanner'
import { CategoryGrid } from '../../organisms/CategoryGrid/CategoryGrid'
import { ProductCarousel } from '../../organisms/ProductCarousel/ProductCarousel'
import { StorefrontSection } from '../shared/StorefrontSection'
import { HomePageLayout } from './HomePageLayout'
import { STOREFRONT_FOOTER_WITH_SOCIALS_PROPS } from '../StorefrontFooter/StorefrontFooter.fixtures'

const meta = {
  title: 'Layouts/HomePageLayout',
  component: HomePageLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomePageLayout>

export default meta

const products = [
  {
    id: 'p1',
    title: 'Nimbus Running Shoe',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=900&fit=crop',
    price: 129,
    originalPrice: 159,
    badge: 'Best Seller',
    rating: 4.8,
    ratingCount: 1264,
    buyCount: 18420,
  },
  {
    id: 'p2',
    title: 'Transit Weekender',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=900&fit=crop',
    price: 84,
    badge: 'New',
    rating: 4.5,
    ratingCount: 342,
    buyCount: 5120,
  },
  {
    id: 'p3',
    title: 'Pulse Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=900&fit=crop',
    price: 219,
    originalPrice: 259,
    rating: 4.7,
    ratingCount: 2891,
    buyCount: 30140,
  },
  {
    id: 'p4',
    title: 'Contour Lounge Chair',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=900&fit=crop',
    price: 399,
    badge: 'Limited',
    rating: 4.6,
    ratingCount: 117,
    buyCount: 980,
  },
]

const categories = [
  {
    title: 'Running',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&h=700&fit=crop',
    href: '/running',
    itemCount: 124,
  },
  {
    title: 'Travel',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=700&fit=crop',
    href: '/travel',
    itemCount: 86,
  },
  {
    title: 'Audio',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&h=700&fit=crop',
    href: '/audio',
    itemCount: 48,
  },
  {
    title: 'Home Office',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=700&fit=crop',
    href: '/office',
    itemCount: 63,
  },
]

export const Default = {
  args: {
    promoBar: <PromoBar message="Free 2-day shipping on orders over $100" variant="brand" />,
    headerProps: {
      cartCount: 3,
      wishlistCount: 7,
      categories: [
        { label: 'New', href: '/new' },
        { label: 'Women', href: '/women' },
        { label: 'Men', href: '/men' },
        { label: 'Home', href: '/home' },
      ],
      logo: <span className="text-xl font-black tracking-tight">QHStore</span>,
    },
    footerProps: {
      ...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS,
    },
    hero: (
      <HeroBanner
        eyebrow="Spring collection"
        title="Compose a polished home page from the existing storefront blocks"
        subtitle="Hero, categories, curated rails, and newsletter all come from the current package inventory."
        ctaLabel="Shop new arrivals"
        secondaryCtaLabel="View lookbook"
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
        align="left"
        size="lg"
      />
    ),
    categories: (
      <StorefrontSection
        eyebrow="Shop by category"
        title="Built around how customers actually browse"
        description="Use the existing category cards and hero to assemble a storefront landing page with minimal custom wiring."
      >
        <CategoryGrid categories={categories} columns={4} />
      </StorefrontSection>
    ),
    featured: (
      <>
        <ProductCarousel
          title="Fresh this week"
          subtitle="Carousel sections can be driven by product arrays."
          viewAllHref="/fresh"
          products={products}
          onAddToCart={() => {}}
        />
        <ProductCarousel
          title="Editor picks"
          subtitle="The layout builds product cards internally for the carousel."
          viewAllHref="/editors-picks"
          products={products.slice(0, 3)}
          onAddToCart={() => {}}
        />
      </>
    ),
    newsletter: <NewsletterSignup />,
    onAddToCart: () => {},
  },
}
