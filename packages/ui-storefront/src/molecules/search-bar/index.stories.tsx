import type { Meta, StoryObj } from '@storybook/react'

import { SearchBar } from './index'

const meta: Meta<typeof SearchBar> = {
  title: 'ui-storefront/molecules/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {
    placeholder: 'Search for products...',
  },
}

export const WithSuggestions: Story = {
  args: {
    placeholder: 'Search products, brands, categories...',
    suggestions: ['Wireless Headphones', 'Running Shoes', 'Smart Watch', 'Coffee Maker'],
  },
}

export const WithRecentSearches: Story = {
  args: {
    placeholder: 'Search for products...',
    recentSearches: ['noise cancelling headphones', 'running shoes size 10', 'laptop stand'],
  },
}

export const WithBoth: Story = {
  args: {
    placeholder: 'Search products...',
    suggestions: ['New Arrivals', 'Best Sellers', 'Summer Sale', 'Gift Ideas'],
    recentSearches: ['mechanical keyboard', 'white sneakers'],
  },
}

export const Loading: Story = {
  args: {
    placeholder: 'Searching...',
    loading: true,
    suggestions: ['Wireless Headphones', 'Running Shoes'],
  },
}

export const DefaultWithCallback: Story = {
  args: {
    placeholder: 'Search products...',
    onSearch: (query: string) => console.log('Search:', query),
  },
}
