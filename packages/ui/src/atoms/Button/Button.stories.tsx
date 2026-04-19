import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingCart, Plus, Trash2, Download, ArrowRight, Mail, Search } from 'lucide-react'

import { Button } from '../../lib/shadcn/button'

const meta: Meta<typeof Button> = {
  title: 'atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>Add to Cart</Button>,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="brand">Brand</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="brand-outline">Brand Outline</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <div aria-label="Search">
        <Button size="icon" icon={<Search className="h-4 w-4" />} />
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button icon={<ShoppingCart className="h-4 w-4" />}>Add to Cart</Button>
      <Button variant="outline" icon={<Plus className="h-4 w-4" />}>
        New Product
      </Button>
      <Button variant="ghost" icon={<Download className="h-4 w-4" />}>
        Export CSV
      </Button>
      <Button variant="brand" icon={<Mail className="h-4 w-4" />}>
        Send Invoice
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Processing...</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
      <Button variant="brand" loading>
        Deploying
      </Button>
      <Button variant="destructive" loading>
        Deleting...
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Default</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="brand" disabled>
        Disabled Brand
      </Button>
      <Button variant="ghost" disabled>
        Disabled Ghost
      </Button>
      <Button loading disabled>
        Loading Disabled
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <div aria-label="Search">
        <Button size="icon" icon={<Search className="h-4 w-4" />} />
      </div>
      <div aria-label="Add item">
        <Button size="icon" icon={<Plus className="h-4 w-4" />} variant="outline" />
      </div>
      <div aria-label="Delete">
        <Button size="icon" icon={<Trash2 className="h-4 w-4" />} variant="destructive" />
      </div>
      <div aria-label="Next">
        <Button size="icon" icon={<ArrowRight className="h-4 w-4" />} variant="ghost" />
      </div>
    </div>
  ),
}

export const EcommerceActions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="brand" icon={<ShoppingCart className="h-4 w-4" />}>
        Buy Now — $129
      </Button>
      <Button variant="outline" icon={<Plus className="h-4 w-4" />}>
        Add to Wishlist
      </Button>
      <Button variant="ghost" icon={<Download className="h-4 w-4" />}>
        Download Specs
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <Button className="w-full">Continue to Checkout</Button>
      <Button variant="outline" className="w-full">
        View Cart
      </Button>
    </div>
  ),
}
