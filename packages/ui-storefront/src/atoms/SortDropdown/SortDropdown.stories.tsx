import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { SortDropdown } from './SortDropdown'
import type { SortOption } from './SortDropdown'

const meta: Meta<typeof SortDropdown> = {
  title: 'atoms/SortDropdown',
  component: SortDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SortDropdown>

const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'rating', label: 'Top rated' },
]

function SortDropdownWithState({
  initialValue,
  options,
  label,
}: {
  initialValue: string
  options: SortOption[]
  label?: string
}) {
  const [value, setValue] = useState(initialValue)

  return <SortDropdown value={value} options={options} onChange={setValue} label={label} />
}

export const Default: Story = {
  render: () => <SortDropdownWithState initialValue="featured" options={PRODUCT_SORT_OPTIONS} />,
}

export const ReviewsSorting: Story = {
  render: () => (
    <SortDropdownWithState
      initialValue="most-recent"
      label="Reviews"
      options={[
        { value: 'most-recent', label: 'Most recent' },
        { value: 'highest-rating', label: 'Highest rating' },
        { value: 'lowest-rating', label: 'Lowest rating' },
        { value: 'with-photos', label: 'With photos' },
      ]}
    />
  ),
}

export const InToolbar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">238 results</p>
        <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">Running shoes for everyday training</p>
      </div>
      <SortDropdownWithState initialValue="price-asc" options={PRODUCT_SORT_OPTIONS} />
    </div>
  ),
}
