import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './index'

const meta = {
  title: 'Atoms/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics' },
    ],
  },
}

export const WithLongPath = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Category', href: '/category' },
      { label: 'Subcategory', href: '/category/sub' },
      { label: 'Product Page' },
    ],
  },
}

export const SingleItem = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
}

export const WithCustomSeparator = {
  args: {
    items: [{ label: 'Home', href: '/' }, { label: 'Settings' }],
    separator: <span style={{ color: '#888', fontSize: '0.75rem' }}>/</span>,
  },
}
