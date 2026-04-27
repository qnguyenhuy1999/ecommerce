import React, { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { OrderFilterBar } from './OrderFilterBar'
import type { OrderFilterBarProps } from './OrderFilterBar'
import type { OrderHistoryTab } from '../../hooks/useOrderHistoryFilter'

const meta: Meta<typeof OrderFilterBar> = {
  title: 'Molecules/OrderFilterBar',
  component: OrderFilterBar,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-5xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OrderFilterBar>

function OrderFilterBarWithState(
  props: Omit<
    OrderFilterBarProps,
    'query' | 'onQueryChange' | 'activeTab' | 'onTabChange' | 'dateRange' | 'onDateRangeChange'
  >,
) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<OrderHistoryTab>('all')
  const [dateRange, setDateRange] = useState('all')

  return (
    <OrderFilterBar
      {...props}
      query={query}
      onQueryChange={setQuery}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    />
  )
}

export const Default: Story = {
  render: () => (
    <OrderFilterBarWithState
      dateRangeOptions={[
        { value: 'all', label: 'All time' },
        { value: '3m', label: 'Last 3 months' },
        { value: '6m', label: 'Last 6 months' },
      ]}
    />
  ),
}
