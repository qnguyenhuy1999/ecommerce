import type { Meta, StoryObj } from '@storybook/react'
import { Package, Search, ShoppingBag, FileText, Wifi } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: <Package className="h-8 w-8" />,
    title: 'No items found',
    description: 'There are no items in this collection yet.',
    action: { label: 'Add Item', onClick: () => {} },
  },
}

export const NoProducts: Story = {
  render: () => (
    <EmptyState
      icon={<ShoppingBag className="h-8 w-8" />}
      title="No products yet"
      description="Start adding products to your catalog. You'll see them appear here as soon as they're created."
      action={{ label: 'Add First Product', onClick: () => {} }}
    />
  ),
}

export const NoSearchResults: Story = {
  render: () => (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title="No results found"
      description="We couldn't find any products matching your search. Try adjusting your filters or search terms."
      action={{ label: 'Clear Search', onClick: () => {}, variant: 'outline' }}
    />
  ),
}

export const NoOrders: Story = {
  render: () => (
    <EmptyState
      icon={<Package className="h-8 w-8" />}
      title="No orders yet"
      description="Once you receive orders, they'll appear here. Start promoting your store to drive sales."
      action={{ label: 'Browse Products', onClick: () => {}, variant: 'brand' }}
    />
  ),
}

export const NoInvoices: Story = {
  render: () => (
    <EmptyState
      icon={<FileText className="h-8 w-8" />}
      title="No invoices"
      description="Invoice history will appear here once you process your first order. All invoices are automatically generated."
      action={{ label: 'Create Invoice', onClick: () => {}, variant: 'outline' }}
    />
  ),
}

export const NoConnection: Story = {
  render: () => (
    <EmptyState
      icon={<Wifi className="h-8 w-8" />}
      title="No internet connection"
      description="Please check your network settings and try again. Your changes will be saved locally."
      action={{ label: 'Retry Connection', onClick: () => {} }}
    />
  ),
}

export const Compact: Story = {
  render: () => (
    <EmptyState
      variant="compact"
      icon={<Search className="h-6 w-6" />}
      title="No results"
      description="No items match your current filters."
    />
  ),
}

export const FullPage: Story = {
  render: () => (
    <EmptyState
      variant="fullpage"
      icon={<ShoppingBag className="h-8 w-8" />}
      title="Your store is ready"
      description="Add your first product to get started. Our platform makes it easy to manage your entire catalog from one place."
      action={{ label: 'Add Your First Product', onClick: () => {}, variant: 'brand' }}
    />
  ),
}
