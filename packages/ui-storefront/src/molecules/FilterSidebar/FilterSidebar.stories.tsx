import type { Meta } from '@storybook/react'

import { FilterSidebar } from './FilterSidebar'
import type { FilterGroupSpec } from './FilterSidebar'

const meta = {
  title: 'molecules/FilterSidebar',
  component: FilterSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterSidebar>

export default meta

const CATEGORY_FILTER: FilterGroupSpec = {
  id: 'category',
  title: 'Category',
  type: 'checkbox',
  options: [
    { value: 'electronics', label: 'Electronics', count: 124 },
    { value: 'clothing', label: 'Clothing', count: 89 },
    { value: 'home', label: 'Home & Garden', count: 56 },
    { value: 'sports', label: 'Sports', count: 34 },
  ],
}

const BRAND_FILTER: FilterGroupSpec = {
  id: 'brand',
  title: 'Brand',
  type: 'checkbox',
  options: [
    { value: 'apple', label: 'Apple', count: 45 },
    { value: 'samsung', label: 'Samsung', count: 38 },
    { value: 'sony', label: 'Sony', count: 22 },
  ],
}

const SIZE_FILTER: FilterGroupSpec = {
  id: 'size',
  title: 'Size',
  type: 'size',
  options: [
    { value: 'xs', label: 'XS' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
  ],
}

const COLOR_FILTER: FilterGroupSpec = {
  id: 'color',
  title: 'Color',
  type: 'color',
  options: [
    /* eslint-disable @ecom/tokens/no-raw-design-values -- color swatch data props, not inline styles */
    { value: 'black', label: 'Black', color: '#111827' },
    { value: 'white', label: 'White', color: '#f9fafb' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'yellow', label: 'Yellow', color: '#eab308' },
    /* eslint-enable @ecom/tokens/no-raw-design-values -- end of color swatch literal data props */
  ],
}

export const Default = {
  render: () => (
    <div className="p-6 border border-border-subtle rounded-[var(--radius-lg)] shadow-[var(--elevation-surface)] max-w-sm">
      <FilterSidebar
        groups={[CATEGORY_FILTER, BRAND_FILTER, SIZE_FILTER, COLOR_FILTER]}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    </div>
  ),
}

export const SingleFilter = {
  render: () => (
    <div className="p-6 border border-border-subtle rounded-[var(--radius-lg)] shadow-[var(--elevation-surface)] max-w-sm">
      <FilterSidebar groups={[CATEGORY_FILTER]} onFilterChange={() => {}} onClearAll={() => {}} />
    </div>
  ),
}

export const PriceRange = {
  render: () => (
    <div className="p-6 border border-border-subtle rounded-[var(--radius-lg)] shadow-[var(--elevation-surface)] max-w-sm">
      <FilterSidebar
        groups={[
          {
            id: 'price',
            title: 'Price Range',
            type: 'range',
            range: {
              min: 0,
              max: 1000,
              step: 10,
              current: [100, 700],
            },
          },
        ]}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    </div>
  ),
}

export const FullFeatured = {
  render: () => (
    <div className="p-6 border border-border-subtle rounded-[var(--radius-lg)] shadow-[var(--elevation-surface)] max-w-sm">
      <FilterSidebar
        groups={[
          CATEGORY_FILTER,
          BRAND_FILTER,
          {
            id: 'price',
            title: 'Price Range',
            type: 'range',
            range: { min: 0, max: 1000, step: 10, current: [100, 700] },
          },
          SIZE_FILTER,
          COLOR_FILTER,
        ]}
        onFilterChange={(groupId, value) => console.log({ groupId, value })}
        onClearAll={() => console.log('cleared')}
      />
    </div>
  ),
}
