import type { Meta, StoryObj } from '@storybook/react'

import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'atoms/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones' },
    ],
  },
}

export const Collapsible: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', href: '/products/electronics' },
          { label: 'Smartphones', href: '/products/electronics/smartphones' },
          { label: 'Accessories', href: '/products/electronics/smartphones/accessories' },
          { label: 'Cases & Covers' },
        ]}
        collapsible
      />
    </div>
  ),
}

export const EcommerceNavigation: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: "Men's Clothing", href: '/shop/mens' },
        { label: 'T-Shirts', href: '/shop/mens/t-shirts' },
        { label: 'Premium Cotton Crew Neck' },
      ]}
    />
  ),
}

export const AdminNavigation: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Orders', href: '/dashboard/orders' },
        { label: '#ORD-2024-1847' },
      ]}
    />
  ),
}

export const ShortPath: Story = {
  render: () => <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Category' }]} />,
}
