import type { Meta, StoryObj } from '@storybook/react'

import { SearchResultsPageLayout } from './SearchResultsPageLayout'
import { SearchResultItem } from '../../molecules/SearchResultItem/SearchResultItem'

const FILTERS = [
  {
    id: 'category',
    label: 'Category',
    type: 'checkbox' as const,
    options: [
      { value: 'headphones', label: 'Headphones', count: 42 },
      { value: 'earbuds', label: 'Earbuds', count: 28 },
      { value: 'speakers', label: 'Speakers', count: 15 },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    type: 'checkbox' as const,
    options: [
      { value: 'sony', label: 'Sony', count: 18 },
      { value: 'bose', label: 'Bose', count: 12 },
      { value: 'jbl', label: 'JBL', count: 21 },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'range' as const,
    min: 0,
    max: 1000,
    step: 10,
  },
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
]

const PRODUCTS = [
  {
    id: '1',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    price: 349.99,
    originalPrice: 429.99,
    rating: 4.7,
    reviewCount: 2841,
    brand: 'Sony',
    inStock: true,
  },
  {
    id: '2',
    name: 'Bose QuietComfort 45 Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    price: 279.99,
    originalPrice: 329.99,
    rating: 4.5,
    reviewCount: 1923,
    brand: 'Bose',
    inStock: true,
  },
  {
    id: '3',
    name: 'JBL Tune 760NC Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    price: 129.99,
    rating: 4.2,
    reviewCount: 847,
    brand: 'JBL',
    inStock: false,
  },
]

const RESULTS = (query: string) => (
  <div className="space-y-3">
    {PRODUCTS.map((p) => (
      <SearchResultItem
        key={p.id}
        product={p}
        query={query}
        onQuickAdd={(id) => alert(`Add: ${id}`)}
        onWishlist={(id) => alert(`Wishlist: ${id}`)}
        onView={(id) => alert(`View: ${id}`)}
      />
    ))}
  </div>
)

const meta: Meta<typeof SearchResultsPageLayout> = {
  title: 'Layouts/SearchResultsPageLayout',
  component: SearchResultsPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof SearchResultsPageLayout>

export const WithResults: Story = {
  args: {
    query: 'wireless headphones',
    totalResults: 85,
    sortValue: 'relevance',
    sortOptions: SORT_OPTIONS,
    onSortChange: (v) => alert(`Sort: ${v}`),
    onSearch: (q) => alert(`Search: ${q}`),
    filters: FILTERS,
    activeFilters: [
      { key: 'brand', label: 'Brand', value: 'Sony' },
      { key: 'category', label: 'Category', value: 'Headphones' },
    ],
    onFilterChange: () => {},
    onClearFilters: () => alert('Clear all'),
    onRemoveFilter: (k, v) => alert(`Remove: ${k}=${v}`),
    relatedQueries: ['noise cancelling', 'over-ear', 'sport headphones'],
    onRelatedQuerySelect: (q) => alert(`Related: ${q}`),
    recentSearches: ['running shoes', 'sony xm5'],
    onRecentQuerySelect: (q) => alert(`Recent: ${q}`),
    results: RESULTS('wireless headphones'),
  },
}

export const NoResults: Story = {
  args: {
    query: 'quantum flux capacitor',
    totalResults: 0,
    sortValue: 'relevance',
    sortOptions: SORT_OPTIONS,
    onSortChange: () => {},
    onSearch: (q) => alert(`Search: ${q}`),
    onBrowseAll: () => alert('Browse all'),
    filters: FILTERS,
    relatedQueries: ['flux capacitor', 'quantum sensor', 'capacitor 4700uF'],
    onRelatedQuerySelect: (q) => alert(`Related: ${q}`),
    results: null,
  },
}

export const NoResultsWithFilters: Story = {
  args: {
    ...NoResults.args,
    activeFilters: [
      { key: 'brand', label: 'Brand', value: 'Sony' },
      { key: 'category', label: 'Category', value: 'Headphones' },
    ],
    onClearFilters: () => alert('Clear filters'),
    onRemoveFilter: (k, v) => alert(`Remove: ${k}=${v}`),
  },
}
