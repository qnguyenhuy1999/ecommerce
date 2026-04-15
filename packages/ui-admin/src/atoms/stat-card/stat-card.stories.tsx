import type { Meta } from '@storybook/react'

import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react'

import { StatCard } from './index'

const meta = {
  title: 'Atoms/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatCard>

export default meta

export const Default = {
  args: {
    label: 'Total Revenue',
    value: '$12,450',
    description: 'This month',
  },
}

export const WithTrend = {
  args: {
    label: 'Total Orders',
    value: '1,284',
    trend: { value: '12.5%', positive: true },
  },
}

export const NegativeTrend = {
  args: {
    label: 'Active Users',
    value: '3,892',
    trend: { value: '3.2%', positive: false },
  },
}

export const WithIcon = {
  args: {
    label: 'Total Sales',
    value: '$48,200',
    trend: { value: '8.1%', positive: true },
    description: 'vs last month',
    icon: <DollarSign />,
  },
}

export const AllIcons = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        padding: '2rem',
        maxWidth: '600px',
      }}>
      <StatCard label="Total Revenue" value="$12,450" icon={<DollarSign />} />
      <StatCard label="Orders" value="1,284" icon={<ShoppingCart />} />
      <StatCard label="Active Users" value="3,892" icon={<Users />} />
      <StatCard label="Products" value="842" icon={<Package />} />
    </div>
  ),
}

export const Skeleton = {
  args: {
    label: 'Loading...',
    value: '—',
  },
}
