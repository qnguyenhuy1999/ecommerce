import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tag, AlertCircle, Star, Zap, Package } from 'lucide-react'

import { Badge } from '../../lib/shadcn/badge'

const meta: Meta<typeof Badge> = {
  title: 'atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="soft">40% OFF</Badge>
      <Badge variant="primary">New Arrival</Badge>
      <Badge variant="warning">Limited Stock</Badge>
      <Badge variant="default">Out of Stock</Badge>
    </div>
  ),
}

export const MarketplaceBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="soft" size="lg">
        Save 40%
      </Badge>
      <Badge variant="soft">Flash Sale</Badge>
      <Badge variant="primary" size="lg">
        New
      </Badge>
      <Badge variant="primary">Just In</Badge>
      <Badge variant="warning">Only 3 left</Badge>
      <Badge variant="default">Sold Out</Badge>
      <Badge variant="warning">Low Stock</Badge>
      <Badge variant="info">Pre-order</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success" icon={<Star className="h-3 w-3 fill-current" />}>
        Bestseller
      </Badge>
      <Badge variant="info" icon={<Zap className="h-3 w-3" />}>
        Fast Shipping
      </Badge>
      <Badge variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
        Almost Gone
      </Badge>
      <Badge variant="soft" icon={<Tag className="h-3 w-3" />}>
        Extra 20% Off
      </Badge>
      <Badge variant="primary" icon={<Package className="h-3 w-3" />}>
        Incoming
      </Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="destructive" dot>
        Offline
      </Badge>
      <Badge variant="warning" dot>
        Busy
      </Badge>
      <Badge variant="info" dot>
        Away
      </Badge>
      <Badge variant="default" dot>
        Idle
      </Badge>
    </div>
  ),
}

export const Removable: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Story render uses hooks for local demo state.
    const [tags, setTags] = useState(['Electronics', 'Under $50', 'Free Returns', 'Prime'])

    return (
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="soft"
            removable
            onRemove={() => {
              setTags((t) => t.filter((x) => x !== tag))
            }}>
            {tag}
          </Badge>
        ))}
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge size="sm" variant="soft">
        Small
      </Badge>
      <Badge size="default" variant="soft">
        Default
      </Badge>
      <Badge size="lg" variant="soft">
        Large
      </Badge>
    </div>
  ),
}

export const OnProductCard: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Badge variant="soft">-40%</Badge>
        <Badge variant="primary">New</Badge>
        <Badge variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
          2 left
        </Badge>
      </div>
      <div className="flex gap-3">
        <Badge variant="success" icon={<Star className="h-3 w-3 fill-current" />}>
          4.8 (128)
        </Badge>
        <Badge variant="info">Free Shipping</Badge>
        <Badge variant="soft" icon={<Zap className="h-3 w-3" />}>
          Prime
        </Badge>
      </div>
    </div>
  ),
}
