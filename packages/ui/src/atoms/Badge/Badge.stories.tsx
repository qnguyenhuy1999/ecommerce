import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tag, AlertCircle, Star, Zap, Package } from 'lucide-react'

import { Badge } from '../../components/ui/badge'

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
      <Badge variant="sale">40% OFF</Badge>
      <Badge variant="new">New Arrival</Badge>
      <Badge variant="limited">Limited Stock</Badge>
      <Badge variant="out-of-stock">Out of Stock</Badge>
    </div>
  ),
}

export const MarketplaceBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="sale" size="lg">
        Save 40%
      </Badge>
      <Badge variant="sale">Flash Sale</Badge>
      <Badge variant="new" size="lg">
        New
      </Badge>
      <Badge variant="new">Just In</Badge>
      <Badge variant="limited">Only 3 left</Badge>
      <Badge variant="out-of-stock">Sold Out</Badge>
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
      <Badge variant="sale" icon={<Tag className="h-3 w-3" />}>
        Extra 20% Off
      </Badge>
      <Badge variant="new" icon={<Package className="h-3 w-3" />}>
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Badge size="sm" variant="sale">
        Small
      </Badge>
      <Badge size="default" variant="sale">
        Default
      </Badge>
      <Badge size="lg" variant="sale">
        Large
      </Badge>
    </div>
  ),
}

export const OnProductCard: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Badge variant="sale">-40%</Badge>
        <Badge variant="new">New</Badge>
        <Badge variant="limited" icon={<AlertCircle className="h-3 w-3" />}>
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
