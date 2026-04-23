import type { Meta } from '@storybook/react'

import { PromoBar } from '../../atoms/PromoBar/PromoBar'
import { ProductCarousel } from '../../organisms/ProductCarousel/ProductCarousel'
import { ProductGallery } from '../../organisms/ProductGallery/ProductGallery'
import { ProductDetailLayout } from './ProductDetailLayout'
import { STOREFRONT_FOOTER_WITH_SOCIALS_PROPS } from '../StorefrontFooter/StorefrontFooter.fixtures'

const meta = {
  title: 'Layouts/ProductDetailLayout',
  component: ProductDetailLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProductDetailLayout>

export default meta

const galleryImages = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1400&fit=crop',
    alt: 'Front view',
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=1400&fit=crop',
    alt: 'Side view',
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1200&h=1400&fit=crop',
    alt: 'Lifestyle view',
  },
]

const relatedProducts = [
  {
    id: 'r1',
    title: 'Travel Audio Case',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=900&fit=crop',
    price: 48,
    rating: 4.6,
    ratingCount: 182,
    buyCount: 5400,
  },
  {
    id: 'r2',
    title: 'Portable DAC',
    image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=800&h=900&fit=crop',
    price: 99,
    rating: 4.7,
    ratingCount: 94,
    buyCount: 2100,
  },
  {
    id: 'r3',
    title: 'Over-ear Stand',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=900&fit=crop',
    price: 36,
    rating: 4.5,
    ratingCount: 201,
    buyCount: 7800,
  },
]

export const Default = {
  args: {
    promoBar: <PromoBar message="Free returns within 30 days" variant="success" />,
    headerProps: {
      cartCount: 1,
      wishlistCount: 2,
      logo: <span className="text-xl font-black tracking-tight">QHStore</span>,
    },
    footerProps: {
      ...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS,
    },
    breadcrumb: 'Home / Audio / Headphones',
    brand: 'QHStore',
    title: 'Pulse Studio Wireless Headphones',
    subtitle:
      'A packaged product detail layout that combines gallery, pricing, badges, variant selectors, reviews, and related products.',
    price: 219,
    originalPrice: 259,
    rating: 4.8,
    reviewCount: 2891,
    status: 'in-stock',
    gallery: (
      <ProductGallery images={galleryImages}>
        <ProductGallery.Thumbnails />
        <ProductGallery.Main />
      </ProductGallery>
    ),
    shippingProgress: {
      current: 219,
      threshold: 250,
    },
    trustBadges: ['verified-seller', 'free-shipping', 'secure-checkout', 'free-returns'],
    variants: [
      {
        name: 'Color',
        type: 'color',
        value: 'black',
        options: [
          { label: 'Black', value: 'black', color: 'var(--gray-900)' },
          { label: 'Stone', value: 'stone', color: 'var(--gray-300)' },
          { label: 'Navy', value: 'navy', color: 'var(--info-500)' },
        ],
      },
      {
        name: 'Finish',
        type: 'pill',
        value: 'matte',
        options: [
          { label: 'Matte', value: 'matte' },
          { label: 'Gloss', value: 'gloss' },
        ],
      },
    ],
    highlights: [
      'Adaptive noise cancellation with transparency mode.',
      'Up to 40 hours of battery life on a single charge.',
      'Low-latency mode tuned for mobile gaming and video.',
    ],
    description: (
      <p>
        This section is intentionally free-form so consuming apps can pass plain text or richer product content without
        replacing the packaged layout.
      </p>
    ),
    reviews: [
      {
        author: 'Avery Chen',
        rating: 5,
        date: 'Apr 2026',
        verified: true,
        title: 'Excellent soundstage',
        content:
          'The balance is clean, the battery life is real, and the clamp force is comfortable for long sessions. It feels like a serious upgrade over the previous model.',
      },
      {
        author: 'Jordan Miller',
        rating: 4,
        date: 'Mar 2026',
        verified: true,
        title: 'Great travel pair',
        content:
          'Noise cancelling is strong on flights and the case is compact enough for weekly travel. I wish the touch controls were a little easier to learn.',
      },
      {
        author: 'Priya Singh',
        rating: 5,
        date: 'Feb 2026',
        title: 'Worth the price',
        content:
          'Setup took seconds and multipoint pairing has been reliable across laptop and phone. The sound remains detailed without becoming harsh, even on longer listening sessions.',
      },
    ],
    related: (
      <ProductCarousel
        title="Pairs well with"
        subtitle="Reuse the existing product card stack for recommendation rails."
        viewAllHref="/audio"
        products={relatedProducts}
        onAddToCart={() => {}}
      />
    ),
    onAddToCart: () => {},
  },
}
