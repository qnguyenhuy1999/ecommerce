import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RevenueChart } from './RevenueChart'

const meta: Meta<typeof RevenueChart> = {
  title: 'organisms/RevenueChart',
  component: RevenueChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RevenueChart>

const mockData7d = [
  { name: 'Mon', total: 1200 },
  { name: 'Tue', total: 1800 },
  { name: 'Wed', total: 1500 },
  { name: 'Thu', total: 2200 },
  { name: 'Fri', total: 2800 },
  { name: 'Sat', total: 1900 },
  { name: 'Sun', total: 1050 },
]

const mockData30d = [
  { name: 'Week 1', total: 8500 },
  { name: 'Week 2', total: 11200 },
  { name: 'Week 3', total: 13500 },
  { name: 'Week 4', total: 15550 },
]

const mockData90d = [
  { name: 'Month 1', total: 45000 },
  { name: 'Month 2', total: 51200 },
  { name: 'Month 3', total: 52000 },
]

export const Default: Story = {
  args: {
    title: 'Revenue Overview',
    totalRevenue: '$48,750',
    period: '30d',
    data: mockData30d,
  },
}

function InteractiveRevenueChart() {
  const [period, setPeriod] = React.useState('30d')

  const currentData = period === '7d' ? mockData7d : period === '30d' ? mockData30d : mockData90d

  return (
    <RevenueChart
      title="Revenue Overview"
      totalRevenue={period === '7d' ? '$12,450' : period === '30d' ? '$48,750' : '$148,200'}
      period={period}
      onPeriodChange={setPeriod}
      data={currentData}
    />
  )
}

export const WithPeriodChange: Story = {
  render: () => <InteractiveRevenueChart />,
}

export const Weekly: Story = {
  args: {
    title: 'Weekly Revenue',
    totalRevenue: '$12,450',
    period: '7d',
    data: mockData7d,
  },
}

export const Quarterly: Story = {
  args: {
    title: 'Quarterly Revenue',
    totalRevenue: '$148,200',
    period: '90d',
    data: mockData90d,
  },
}
