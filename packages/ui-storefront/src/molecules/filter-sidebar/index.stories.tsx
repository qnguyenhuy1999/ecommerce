import type { Meta, StoryObj } from '@storybook/react'

import { FilterSidebar } from './index'

const meta: Meta<typeof FilterSidebar> = {
  title: 'ui-storefront/molecules/FilterSidebar',
  component: FilterSidebar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FilterSidebar>

const FULL_FILTERS = [
  {
    id: 'category',
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Electronics', value: 'electronics', count: 284 },
      { label: 'Clothing', value: 'clothing', count: 512 },
      { label: 'Home & Garden', value: 'home', count: 198 },
      { label: 'Sports & Outdoors', value: 'sports', count: 143 },
      { label: 'Books', value: 'books', count: 67 },
    ],
  },
  {
    id: 'price',
    title: 'Price Range',
    type: 'range' as const,
    range: { min: 0, max: 500, step: 10, current: [0, 300] },
  },
  {
    id: 'color',
    title: 'Color',
    type: 'color' as const,
    options: [
      { label: 'Black', value: 'black', color: '#1a1a1a' },
      { label: 'White', value: 'white', color: '#ffffff' },
      { label: 'Navy', value: 'navy', color: '#1e3a5f' },
      { label: 'Red', value: 'red', color: '#dc2626' },
      { label: 'Green', value: 'green', color: '#16a34a' },
      { label: 'Gray', value: 'gray', color: '#6b7280' },
    ],
  },
  {
    id: 'size',
    title: 'Size',
    type: 'size' as const,
    options: [
      { label: 'XS', value: 'xs' },
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
      { label: 'XXL', value: 'xxl' },
    ],
  },
]

const SIMPLE_FILTERS = [
  {
    id: 'brand',
    title: 'Brand',
    type: 'checkbox' as const,
    options: [
      { label: 'Nike', value: 'nike', count: 89 },
      { label: 'Adidas', value: 'adidas', count: 74 },
      { label: 'Puma', value: 'puma', count: 45 },
      { label: 'Reebok', value: 'reebok', count: 32 },
    ],
  },
]

const COLOR_FILTERS = [
  {
    id: 'color',
    title: 'Color',
    type: 'color' as const,
    options: [
      { label: 'Black', value: 'black', color: '#1a1a1a' },
      { label: 'White', value: 'white', color: '#ffffff' },
      { label: 'Red', value: 'red', color: '#dc2626' },
      { label: 'Blue', value: 'blue', color: '#2563eb' },
      { label: 'Green', value: 'green', color: '#16a34a' },
      { label: 'Yellow', value: 'yellow', color: '#eab308' },
    ],
  },
]

export const Default: Story = {
  args: {
    groups: FULL_FILTERS,
  },
}

export const SimpleFilters: Story = {
  args: {
    groups: SIMPLE_FILTERS,
  },
}

export const ColorFilters: Story = {
  args: {
    groups: COLOR_FILTERS,
  },
}

export const WithClearAll: Story = {
  args: {
    groups: FULL_FILTERS,
    onClearAll: () => console.log('Cleared all filters'),
  },
}

export const EmptyState: Story = {
  args: {
    groups: [],
  },
}
