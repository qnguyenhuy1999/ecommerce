'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Flame, Gift, Headphones, Shirt, Zap } from 'lucide-react'

import {
  CategoryGrid,
  HeroBanner,
  HomePageLayout,
  NewsletterSignup,
  ProductCarousel,
  QuickNavSection,
  StorefrontFooter,
  StorefrontHeader,
  StorefrontSection,
  TrustBannerSection,
} from '@ecom/ui-storefront'

import type { ProductResponse } from '@ecom/api-types'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import { toStorefrontProduct } from '@/lib/product-mapper'

/**
 * All static UI fragments are hoisted to module scope so navigations between
 * storefront routes don't re-allocate identical JSX trees on every render.
 */
const FEATURED_CATEGORIES = [
  {
    title: 'Fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=700&fit=crop',
    href: '/products?categoryId=fashion',
    itemCount: 0,
  },
  {
    title: 'Audio',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&h=700&fit=crop',
    href: '/products?categoryId=audio',
    itemCount: 0,
  },
  {
    title: 'Home',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=700&fit=crop',
    href: '/products?categoryId=home',
    itemCount: 0,
  },
  {
    title: 'Outdoors',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=700&fit=crop',
    href: '/products?categoryId=outdoors',
    itemCount: 0,
  },
]

const QUICK_NAV_ITEMS = [
  { icon: <Flame />, label: 'Hot Deals', href: '/products?onSale=true' },
  { icon: <Zap />, label: 'New', href: '/products?sort=newest' },
  { icon: <Headphones />, label: 'Audio', href: '/products?categoryId=audio' },
  { icon: <Shirt />, label: 'Fashion', href: '/products?categoryId=fashion' },
  { icon: <Gift />, label: 'Gifts', href: '/products?categoryId=gifts' },
]

const HERO_NODE = (
  <HeroBanner
    eyebrow="Welcome to the marketplace"
    title="Discover thousands of products from trusted sellers"
    subtitle="Shop across every category — from fashion to electronics — with fast checkout and secure payments."
    ctaLabel="Browse all products"
    ctaHref="/products"
    secondaryCtaLabel="View deals"
    secondaryCtaHref="/products?onSale=true"
    backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
    align="left"
    size="lg"
  />
)

const CATEGORIES_NODE = (
  <StorefrontSection
    eyebrow="Shop by category"
    title="Browse the catalog"
    description="Curated departments to help you find exactly what you need."
  >
    <CategoryGrid categories={FEATURED_CATEGORIES} columns={4} />
  </StorefrontSection>
)

const TRUST_NODE = <TrustBannerSection />
const NEWSLETTER_NODE = <NewsletterSignup />
const QUICK_NAV_NODE = <QuickNavSection items={QUICK_NAV_ITEMS} />

export interface HomeViewProps {
  initialProducts: ProductResponse[]
}

/**
 * Client-side view for the home page. Receives products fetched on the server
 * so the first paint is data-complete; further navigation can use
 * `react-query` if/when we add live updates here.
 */
export function HomeView({ initialProducts }: HomeViewProps) {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const products = React.useMemo(
    () => initialProducts.map(toStorefrontProduct),
    [initialProducts],
  )

  return (
    <HomePageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      trustBanner={TRUST_NODE}
      quickNav={QUICK_NAV_NODE}
      hero={HERO_NODE}
      categories={CATEGORIES_NODE}
      bestSellers={
        products.length === 0 ? (
          <StorefrontSection
            title="Featured products"
            description="No products are listed yet. Check back soon as sellers onboard."
          />
        ) : (
          <ProductCarousel
            title="Featured products"
            viewAllHref="/products"
            products={products.slice(0, 8)}
            onAddToCart={(id) => router.push(`/products/${id}`)}
          />
        )
      }
      newsletter={NEWSLETTER_NODE}
    />
  )
}

/** Lightweight skeleton displayed while server data streams in. */
export function HomeViewSkeleton() {
  return (
    <div
      aria-busy
      className="min-h-[60vh] animate-pulse bg-[var(--surface-muted)]"
    />
  )
}
