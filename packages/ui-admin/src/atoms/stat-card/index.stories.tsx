import type { Meta, StoryObj } from '@storybook/react'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react'

import { StatCard } from './index'

const meta = {
  title: 'ui-admin/atoms/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatCard>

export default meta

export const Default: StoryObj<typeof StatCard> = {
  args: {
    label: 'Total Revenue',
    value: '$12,450',
    description: 'This month',
  },
}

export const WithTrend: StoryObj<typeof StatCard> = {
  args: {
    label: 'Total Orders',
    value: '1,284',
    trend: { value: '12.5%', positive: true },
    description: 'vs last month',
  },
}

export const NegativeTrend: StoryObj<typeof StatCard> = {
  args: {
    label: 'Active Users',
    value: '3,892',
    trend: { value: '3.2%', positive: false },
    description: 'vs last month',
  },
}

export const WithIcon: StoryObj<typeof StatCard> = {
  args: {
    label: 'Total Sales',
    value: '$48,200',
    trend: { value: '8.1%', positive: true },
    description: 'vs last month',
    icon: <DollarSign />,
  },
}

export const Compact: StoryObj<typeof StatCard> = {
  args: {
    label: 'Avg Order Value',
    value: '$89',
    trend: { value: '4.2%', positive: true },
    variant: 'compact',
  },
}

export const Prominent: StoryObj<typeof StatCard> = {
  args: {
    label: 'Monthly Recurring Revenue',
    value: '$124,500',
    trend: { value: '15.3%', positive: true },
    description: 'vs last month',
    icon: <TrendingUp />,
    variant: 'prominent',
  },
}

export const Loading: StoryObj<typeof StatCard> = {
  args: {
    label: 'Loading...',
    value: '—',
    loading: true,
  },
}

export const AllVariants: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 w-full max-w-5xl">
      <StatCard label="Total Revenue" value="$84,320" trend={{ value: '12.5%', positive: true }} icon={<DollarSign />} />
      <StatCard label="Orders" value="1,284" trend={{ value: '8.3%', positive: true }} icon={<ShoppingCart />} />
      <StatCard label="Active Users" value="3,892" trend={{ value: '22.1%', positive: true }} icon={<Users />} />
      <StatCard label="Products" value="842" icon={<Package />} />
    </div>
  ),
}
