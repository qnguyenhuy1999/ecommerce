import type { Meta, StoryObj } from '@storybook/react'

import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'molecules/Breadcrumb',
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
      { label: 'Audio', href: '/products/audio' },
      { label: 'Wireless Headphones' },
    ],
  },
}

export const Collapsible: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Catalog', href: '/catalog' },
          { label: 'Electronics', href: '/catalog/electronics' },
          { label: 'Computers', href: '/catalog/electronics/computers' },
          { label: 'Laptops', href: '/catalog/electronics/computers/laptops' },
          { label: 'Ultrabooks' },
        ]}
        collapsible
      />
    </div>
  ),
}

export const AdminNavigation: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Orders', href: '/admin/orders' },
      { label: 'Order #1847' },
    ],
  },
}

export const CustomSeparator: Story = {
  args: {
    separator: '•',
    items: [
      { label: 'Women', href: '/women' },
      { label: 'Shoes', href: '/women/shoes' },
      { label: 'Sneakers' },
    ],
  },
}
