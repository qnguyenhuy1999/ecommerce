import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingCart, DollarSign, Users, Package, Eye } from 'lucide-react'

import { MetricCard } from './index'

const meta = {
  title: 'ui-admin/atoms/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
} satisfies Meta<typeof MetricCard>

export default meta

export const Default: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Total Revenue',
    value: 84320,
    format: 'currency',
    icon: <DollarSign />,
  },
}

export const CurrencyFormat: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Total Revenue',
    value: 84320,
    previousValue: 75000,
    format: 'currency',
    icon: <DollarSign />,
  },
}

export const NumberFormat: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Total Orders',
    value: 1284,
    previousValue: 1100,
    format: 'number',
    icon: <ShoppingCart />,
  },
}

export const PercentFormat: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Conversion Rate',
    value: 3.4,
    previousValue: 3.6,
    format: 'percent',
    icon: <Eye />,
  },
}

export const PositiveChange: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Active Users',
    value: 3892,
    previousValue: 3200,
    format: 'number',
    icon: <Users />,
  },
}

export const NegativeChange: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Cart Abandonment',
    value: 42,
    previousValue: 38,
    format: 'percent',
    icon: <ShoppingCart />,
  },
}

export const NoPreviousValue: StoryObj<typeof MetricCard> = {
  args: {
    label: 'Products Sold',
    value: 8420,
    format: 'number',
    icon: <Package />,
  },
}
