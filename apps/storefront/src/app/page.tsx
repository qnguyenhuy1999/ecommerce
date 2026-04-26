'use client'

import { useRouter } from 'next/navigation'

import { Flame, Gift, Headphones, Shirt, Zap } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'

import { productClient } from '@ecom/api-client'

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

import { useStorefrontChrome } from '@/components/storefront-chrome'
import { toStorefrontProduct } from '@/lib/product-mapper'

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

export default function HomePage() {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => productClient.list({ page: 1, limit: 12 }),
  })

  const products = (data?.data ?? []).map(toStorefrontProduct)

  return (
    <HomePageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      trustBanner={<TrustBannerSection />}
      quickNav={
        <QuickNavSection
          items={[
            { icon: <Flame />, label: 'Hot Deals', href: '/products?onSale=true' },
            { icon: <Zap />, label: 'New', href: '/products?sort=newest' },
            { icon: <Headphones />, label: 'Audio', href: '/products?categoryId=audio' },
            { icon: <Shirt />, label: 'Fashion', href: '/products?categoryId=fashion' },
            { icon: <Gift />, label: 'Gifts', href: '/products?categoryId=gifts' },
          ]}
        />
      }
      hero={
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
      }
      categories={
        <StorefrontSection
          eyebrow="Shop by category"
          title="Browse the catalog"
          description="Curated departments to help you find exactly what you need."
        >
          <CategoryGrid categories={FEATURED_CATEGORIES} columns={4} />
        </StorefrontSection>
      }
      bestSellers={
        isLoading ? (
          <StorefrontSection title="Featured products" description="Loading the latest from our sellers...">
            <ProductCarouselSkeleton />
          </StorefrontSection>
        ) : products.length === 0 ? (
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
      newsletter={<NewsletterSignup />}
    />
  )
}

function ProductCarouselSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]"
        />
      ))}
    </div>
  )
}
