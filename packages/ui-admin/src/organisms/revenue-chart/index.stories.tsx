import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RevenueChart } from './index'

const meta: Meta<typeof RevenueChart> = {
  title: 'ui-admin/organisms/RevenueChart',
  component: RevenueChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RevenueChart>

export const Default: Story = {
  args: {
    title: 'Revenue Overview',
    totalRevenue: '$48,750',
    period: '30d',
  },
}

function InteractiveRevenueChart() {
  const [period, setPeriod] = React.useState('30d')
  return (
    <RevenueChart
      title="Revenue Overview"
      totalRevenue={period === '7d' ? '$12,450' : period === '30d' ? '$48,750' : '$148,200'}
      period={period}
      onPeriodChange={setPeriod}
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
  },
}

export const Quarterly: Story = {
  args: {
    title: 'Quarterly Revenue',
    totalRevenue: '$148,200',
    period: '90d',
  },
}
