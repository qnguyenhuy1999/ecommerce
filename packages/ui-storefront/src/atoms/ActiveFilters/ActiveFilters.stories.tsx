import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { ActiveFilters } from './ActiveFilters'
import type { ActiveFilter } from './ActiveFilters'

const meta: Meta<typeof ActiveFilters> = {
  title: 'atoms/ActiveFilters',
  component: ActiveFilters,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ActiveFilters>

const DEFAULT_FILTERS: ActiveFilter[] = [
  { key: 'category', label: 'Category', value: 'Sneakers' },
  { key: 'brand', label: 'Brand', value: 'Nike' },
  { key: 'price', label: 'Price', value: '$50 - $100' },
]

function ActiveFiltersWithState({ initialFilters }: { initialFilters: ActiveFilter[] }) {
  const [filters, setFilters] = useState(initialFilters)

  return (
    <div className="max-w-3xl">
      <ActiveFilters
        filters={filters}
        onRemove={(key, value) => {
          setFilters((current) => current.filter((filter) => !(filter.key === key && filter.value === value)))
        }}
        onClearAll={() => {
          setFilters([])
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <ActiveFiltersWithState initialFilters={DEFAULT_FILTERS} />,
}

export const ManyFilters: Story = {
  render: () => (
    <ActiveFiltersWithState
      initialFilters={[
        ...DEFAULT_FILTERS,
        { key: 'size', label: 'Size', value: 'US 9' },
        { key: 'color', label: 'Color', value: 'Black' },
        { key: 'shipping', label: 'Shipping', value: 'Free delivery' },
      ]}
    />
  ),
}

export const SingleFilter: Story = {
  render: () => (
    <ActiveFiltersWithState initialFilters={[{ key: 'availability', label: 'Availability', value: 'In stock' }]} />
  ),
}
