import type { Meta } from '@storybook/react'

import { ProductBadge } from '../../atoms/Badge/Badge'
import { PromoBar } from '../../atoms/PromoBar/PromoBar'
import { ActiveFilters } from '../../atoms/ActiveFilters/ActiveFilters'
import { ProductGrid } from '../../organisms/ProductGrid/ProductGrid'
import { CollectionPageLayout } from './CollectionPageLayout'
import { STOREFRONT_FOOTER_WITH_SOCIALS_PROPS } from '../StorefrontFooter/StorefrontFooter.fixtures'

const meta = {
  title: 'Layouts/CollectionPageLayout',
  component: CollectionPageLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CollectionPageLayout>

export default meta

const products = [
  {
    id: 's1',
    title: 'Aero Sprint',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=900&fit=crop',
    price: 118,
    originalPrice: 148,
    rating: 4.8,
    ratingCount: 824,
    buyCount: 14200,
    badge: <ProductBadge variant="success">Popular</ProductBadge>,
  },
  {
    id: 's2',
    title: 'Cloud Motion',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=900&fit=crop',
    price: 134,
    rating: 4.6,
    ratingCount: 421,
    buyCount: 9800,
  },
  {
    id: 's3',
    title: 'Harbor Low',
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&h=900&fit=crop',
    price: 96,
    rating: 4.5,
    ratingCount: 203,
    buyCount: 7400,
  },
  {
    id: 's4',
    title: 'Motion Knit',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=900&fit=crop',
    price: 142,
    originalPrice: 172,
    rating: 4.9,
    ratingCount: 1392,
    buyCount: 22100,
  },
]

const SORT_BAR = (
  <>
    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
      <ActiveFilters
        filters={[
          { key: 'size', label: 'Size', value: '8' },
          { key: 'color', label: 'Color', value: 'Sand' },
        ]}
        onRemove={() => {}}
        onClearAll={() => {}}
      />
    </div>
    <label className="flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--text-secondary)]">
      Sort by
      <select
        className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-base)] px-[var(--space-3)] py-[var(--space-1-5)] text-[length:var(--text-sm)] font-medium text-[var(--text-primary)] focus-visible:border-[var(--action-primary)] focus-visible:outline-none"
        defaultValue="relevance"
      >
        <option value="relevance">Most relevant</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </label>
  </>
)

export const Default = {
  args: {
    promoBar: <PromoBar message="Members save an extra 10% this week" variant="info" />,
    headerProps: {
      cartCount: 2,
      categories: [
        { label: 'Women', href: '/women' },
        { label: 'Men', href: '/men' },
        { label: 'Shoes', href: '/shoes' },
      ],
      logo: <span className="text-xl font-black tracking-tight">QHStore</span>,
    },
    footerProps: {
      ...STOREFRONT_FOOTER_WITH_SOCIALS_PROPS,
    },
    breadcrumb: 'Home / Women / Sneakers',
    title: "Women's sneakers",
    description:
      'Lightweight runners and statement low-tops, hand-picked for everyday performance and weekend comfort.',
    resultsLabel: '1,248 results',
    discoveryToolbar: SORT_BAR,
    filters: [
      {
        id: 'size',
        title: 'Size',
        type: 'size',
        options: [
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
        ],
      },
      {
        id: 'color',
        title: 'Color',
        type: 'color',
        options: [
          { label: 'Black', value: 'black', color: 'var(--gray-900)' },
          { label: 'Sand', value: 'sand', color: 'var(--gray-200)' },
          { label: 'Coral', value: 'coral', color: 'var(--brand-300)' },
        ],
      },
      {
        id: 'price',
        title: 'Price',
        type: 'range',
        range: { min: 50, max: 300, step: 10, current: [80, 220] },
      },
      {
        id: 'brand',
        title: 'Brand',
        type: 'checkbox',
        options: [
          { label: 'Aero', value: 'aero', count: 124 },
          { label: 'Cloud', value: 'cloud', count: 86 },
          { label: 'Harbor', value: 'harbor', count: 42 },
        ],
      },
    ],
    grid: <ProductGrid products={products} />,
  },
}

export const Empty = {
  args: {
    ...Default.args,
    title: "Women's sneakers",
    resultsLabel: '0 results',
    grid: <ProductGrid products={[]} emptyMessage="Try removing a filter or two." />,
  },
}
