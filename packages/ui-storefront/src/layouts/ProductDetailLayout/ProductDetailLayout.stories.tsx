import type { Meta, StoryObj } from '@storybook/react'

import type { TrustBadgeType } from '../../atoms/TrustBadge/TrustBadge'
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
type Story = StoryObj<typeof ProductDetailLayout>

const galleryImages = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1400&fit=crop',
    alt: 'Front view — Pulse Studio Wireless Headphones',
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=1400&fit=crop',
    alt: 'Side view — Pulse Studio Wireless Headphones',
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1200&h=1400&fit=crop',
    alt: 'Lifestyle view — Pulse Studio Wireless Headphones',
  },
  {
    id: 'g4',
    src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&h=1400&fit=crop',
    alt: 'Detail view — Pulse Studio Wireless Headphones',
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
  {
    id: 'r4',
    title: 'Premium Ear Cushions',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=900&fit=crop',
    price: 29,
    originalPrice: 39,
    rating: 4.8,
    ratingCount: 342,
    buyCount: 12400,
  },
]

const trustBadges: TrustBadgeType[] = ['verified-seller', 'free-shipping', 'secure-checkout', 'free-returns']

const sharedArgs = {
  promoBar: <PromoBar message="Free returns within 30 days — No questions asked" variant="success" />,
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
    'Premium over-ear wireless headphones with adaptive noise cancellation, 40-hour battery, and low-latency audio for immersive listening.',
  price: 219,
  originalPrice: 259,
  rating: 4.8,
  reviewCount: 2891,
  status: 'in-stock' as const,
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
  trustBadges,
  variants: [
    {
      name: 'Color',
      type: 'color' as const,
      value: 'black',
      options: [
        { label: 'Black', value: 'black', color: 'var(--gray-900)' },
        { label: 'Stone', value: 'stone', color: 'var(--gray-300)' },
        { label: 'Navy', value: 'navy', color: 'var(--info-500)' },
      ],
    },
    {
      name: 'Finish',
      type: 'pill' as const,
      value: 'matte',
      options: [
        { label: 'Matte', value: 'matte' },
        { label: 'Gloss', value: 'gloss' },
      ],
    },
  ],
  ctaMicrocopy: 'Ships today',
  highlights: [
    'Adaptive noise cancellation with transparency mode.',
    'Up to 40 hours of battery life on a single charge.',
    'Low-latency mode tuned for mobile gaming and video.',
    'Premium memory foam ear cushions for all-day comfort.',
  ],
  description: (
    <p>
      Engineered for audiophiles and everyday listeners alike, the Pulse Studio delivers studio-grade sound in a sleek,
      comfortable design. The advanced ANC technology adapts to your environment in real-time, while the 40mm custom
      drivers produce rich, detailed audio across all frequencies.
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
    {
      author: 'Marcus Lee',
      rating: 5,
      date: 'Jan 2026',
      verified: true,
      title: 'Best in class ANC',
      content:
        'I commute daily on the subway and these block out everything. The transparency mode is also perfectly tuned — I can have a conversation without removing them.',
    },
    {
      author: 'Sarah Kim',
      rating: 3,
      date: 'Dec 2025',
      title: 'Good but heavy',
      content:
        'Sound quality is excellent and ANC is top-tier, but they are noticeably heavier than competitors. After 3+ hours my neck starts to feel it. Great for shorter sessions.',
    },
    {
      author: 'David Torres',
      rating: 4,
      date: 'Nov 2025',
      verified: true,
      title: 'Premium feel',
      content:
        'The build quality is exceptional — metal hinges, soft-touch materials, and the carrying case is premium. Battery life easily lasts a full work week for me.',
    },
  ],
  related: (
    <ProductCarousel
      title="Pairs well with"
      subtitle="Complete your audio setup with these hand-picked accessories."
      viewAllHref="/audio"
      products={relatedProducts}
      onAddToCart={() => {}}
    />
  ),
  onAddToCart: () => {},
}

/** Full PDP with all conversion elements */
export const Default: Story = {
  args: sharedArgs,
}

/** Low stock urgency variant */
export const LowStock: Story = {
  args: {
    ...sharedArgs,
    status: 'low-stock' as const,
    statusCount: 3,
  },
}

/** Out of stock variant */
export const OutOfStock: Story = {
  args: {
    ...sharedArgs,
    status: 'out-of-stock' as const,
  },
}

/** Minimal — no sale, no variants */
export const Minimal: Story = {
  args: {
    ...sharedArgs,
    originalPrice: undefined,
    variants: [],
    shippingProgress: undefined,
    ctaMicrocopy: undefined,
    reviews: [],
  },
}
