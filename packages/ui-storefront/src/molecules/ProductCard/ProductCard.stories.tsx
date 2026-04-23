import type { Meta } from '@storybook/react'

import { Button } from '@ecom/ui'

import { Badge } from '../../atoms/Badge/Badge'

import {
  ProductCard,
  ProductCardActions,
  ProductCardBadge,
  ProductCardContent,
  ProductCardHighlights,
  ProductCardImage,
  ProductCardMeta,
  ProductCardPrice,
  ProductCardRating,
  ProductCardSubtitle,
  ProductCardSwatches,
  ProductCardTitle,
} from './ProductCard'

const meta = {
  title: 'molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProductCard>

export default meta

type ProductCardStoryArgs = Omit<React.ComponentProps<typeof ProductCard>, 'children'> & {
  image?: string
  badge?: React.ReactNode
  subtitle?: string
  rating?: number
  reviews?: number
  meta?: React.ReactNode
  highlights?: string[]
  colors?: string[]
  price?: number
  originalPrice?: number
  currencyCode?: string
  locale?: string
  currency?: string
  onAddToCart?: () => void
}

const renderProductCard = (args: ProductCardStoryArgs) => (
  <div className="w-[20rem]">
    <ProductCard id={args.id} title={args.title} loading={args.loading} href={args.href}>
      {args.image && <ProductCardImage src={args.image} alt={args.title} />}
      {args.badge && <ProductCardBadge>{args.badge}</ProductCardBadge>}
      <ProductCardContent>
        {args.subtitle && <ProductCardSubtitle>{args.subtitle}</ProductCardSubtitle>}
        <ProductCardTitle />
        {(args.rating || args.reviews) && <ProductCardRating value={args.rating ?? 4.7} count={args.reviews} />}
        {args.meta && <ProductCardMeta>{args.meta}</ProductCardMeta>}
        {args.highlights && <ProductCardHighlights items={args.highlights} />}
        {args.colors && <ProductCardSwatches colors={args.colors} />}
        {args.price !== undefined && (
          <ProductCardPrice
            price={args.price}
            originalPrice={args.originalPrice}
            currency={args.currency}
            currencyCode={args.currencyCode}
            locale={args.locale}
          />
        )}
      </ProductCardContent>
      {args.onAddToCart && (
        <ProductCardActions>
          <Button size="sm" className="w-full sm:w-auto" onClick={args.onAddToCart}>
            Add to Cart
          </Button>
        </ProductCardActions>
      )}
    </ProductCard>
  </div>
)

export const Default = {
  render: renderProductCard,
  args: {
    id: 'prod-1',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    href: '#',
    subtitle: 'Audio',
    title: 'Premium Wireless Headphones with Spatial Audio',
    price: 149.99,
    reviews: 1280,
    rating: 4.8,
    meta: (
      <>
        <span>Free returns</span>
        <span>•</span>
        <span>2-year warranty</span>
      </>
    ),
    highlights: ['Fast shipping', 'Best seller'],
    colors: ['#000000', '#ffffff', '#e00b41'], // eslint-disable-line @ecom/tokens/no-raw-design-values -- color swatches are data props, not style values
    onAddToCart: () => console.log('added'),
  },
}

export const WithOriginalPrice = {
  render: renderProductCard,
  args: {
    id: 'prod-2',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    href: '#',
    subtitle: 'Office Essentials',
    title: 'Mechanical Keyboard with Multi-Device Pairing',
    price: 79.99,
    originalPrice: 129.99,
    reviews: 392,
    rating: 4.6,
    highlights: ['Limited stock', 'Free delivery'],
    onAddToCart: () => console.log('added'),
  },
}

export const WithBadge = {
  render: renderProductCard,
  args: {
    id: 'prod-3',
    image: 'https://images.unsplash.com/photo-1601924928376-8236731d9788?w=400&h=300&fit=crop',
    href: '#',
    subtitle: 'Fashion',
    title: 'Quilted Crossbody Bag with Gold Chain',
    price: 249,
    currencyCode: 'USD',
    reviews: 740,
    rating: 4.9,
    badge: <Badge variant="destructive">-30%</Badge>,
    highlights: ['Trending', 'Gift ready'],
    onAddToCart: () => console.log('added'),
  },
}

export const GlobalCurrency = {
  render: renderProductCard,
  args: {
    id: 'prod-4',
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=400&h=300&fit=crop',
    href: '#',
    subtitle: 'Home & Decor',
    title: 'Minimal Ceramic Lamp Set',
    price: 189,
    originalPrice: 239,
    currencyCode: 'EUR',
    locale: 'de-DE',
    reviews: 264,
    rating: 4.7,
    meta: (
      <>
        <span>Ships worldwide</span>
        <span>•</span>
        <span>Carbon-neutral packaging</span>
      </>
    ),
    highlights: ['Eco friendly', 'Designer pick'],
    onAddToCart: () => console.log('added'),
  },
}

export const Loading = {
  render: renderProductCard,
  args: {
    id: 'loading',
    image: '',
    title: '',
    price: 0,
    loading: true,
  },
}

export const AllVariants = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">
      {renderProductCard({
        id: 'prod-1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        subtitle: 'Audio',
        title: 'Premium Wireless Headphones',
        price: 149.99,
        rating: 4.8,
        reviews: 1280,
        highlights: ['Fast shipping', 'Best seller'],
        href: '#',
        onAddToCart: () => {},
      })}
      {renderProductCard({
        id: 'prod-2',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        subtitle: 'Office Essentials',
        title: 'Mechanical Keyboard',
        price: 79.99,
        originalPrice: 129.99,
        rating: 4.6,
        reviews: 392,
        highlights: ['Limited stock', 'Free delivery'],
        href: '#',
        onAddToCart: () => {},
      })}
      {renderProductCard({
        id: 'prod-3',
        image: 'https://images.unsplash.com/photo-1601924928376-8236731d9788?w=400&h=300&fit=crop',
        subtitle: 'Fashion',
        title: 'Quilted Crossbody Bag',
        price: 249,
        currencyCode: 'USD',
        badge: <Badge variant="sale">-30%</Badge>,
        rating: 4.9,
        reviews: 740,
        highlights: ['Trending', 'Gift ready'],
        href: '#',
        onAddToCart: () => {},
      })}
    </div>
  ),
}
