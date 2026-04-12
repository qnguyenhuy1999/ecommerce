import type { FilterSidebarProps, FilterConfig } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { FilterSidebar } from './index'

const meta = {
  title: 'Molecules/FilterSidebar',
  component: FilterSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterSidebar>

export default meta
type Story = StoryObj<typeof meta>

const CATEGORY_FILTER: FilterConfig = {
  id: 'category',
  label: 'Category',
  type: 'checkbox',
  options: [
    { value: 'electronics', label: 'Electronics', count: 124 },
    { value: 'clothing', label: 'Clothing', count: 89 },
    { value: 'home', label: 'Home & Garden', count: 56 },
    { value: 'sports', label: 'Sports', count: 34 },
  ],
}

const BRAND_FILTER: FilterConfig = {
  id: 'brand',
  label: 'Brand',
  type: 'checkbox',
  options: [
    { value: 'apple', label: 'Apple', count: 45 },
    { value: 'samsung', label: 'Samsung', count: 38 },
    { value: 'sony', label: 'Sony', count: 22 },
  ],
}

const SORT_FILTER: FilterConfig = {
  id: 'sort',
  label: 'Sort By',
  type: 'radio',
  options: [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ],
}

export const Default = {
  render: () => (
    <div className="border rounded-lg overflow-hidden">
      <FilterSidebar
        filters={[CATEGORY_FILTER, BRAND_FILTER, SORT_FILTER]}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    </div>
  ),
}

export const SingleFilter = {
  render: () => (
    <div className="border rounded-lg overflow-hidden">
      <FilterSidebar filters={[CATEGORY_FILTER]} onFilterChange={() => {}} onClear={() => {}} />
    </div>
  ),
}

export const PriceRange = {
  render: () => (
    <div className="border rounded-lg overflow-hidden">
      <FilterSidebar
        filters={[
          {
            id: 'price',
            label: 'Price Range',
            type: 'price-range',
          },
        ]}
        onFilterChange={() => {}}
        onClear={() => {}}
      />
    </div>
  ),
}
