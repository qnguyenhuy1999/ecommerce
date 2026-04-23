import type { Meta } from '@storybook/react'
import { Flame, Ticket, Gamepad2, Gift, Gem, Zap, Shirt, Home } from 'lucide-react'
import { QuickNavSection } from './QuickNavSection'

const meta = {
  title: 'Organisms/QuickNavSection',
  component: QuickNavSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof QuickNavSection>

export default meta

export const Default = {
  args: {
    items: [
      { icon: <Flame />, label: 'Hot Deals', href: '#' },
      { icon: <Ticket />, label: 'Coupons', href: '#' },
      { icon: <Gamepad2 />, label: 'Electronics', href: '#' },
      { icon: <Gift />, label: 'Gifts', href: '#' },
      { icon: <Gem />, label: 'Premium', href: '#' },
      { icon: <Zap />, label: 'Flash Sale', href: '#' },
      { icon: <Shirt />, label: 'Fashion', href: '#' },
      { icon: <Home />, label: 'Living', href: '#' },
    ],
  },
}
