import type { Meta, StoryObj } from '@storybook/react'
import { Badge, badgeVariants } from './index'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    children: 'Badge',
  },
}

export const Secondary = {
  args: {
    children: 'In Stock',
    variant: 'secondary',
  },
}

export const Destructive = {
  args: {
    children: 'Out of Stock',
    variant: 'destructive',
  },
}

export const Outline = {
  args: {
    children: 'Draft',
    variant: 'outline',
  },
}

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      {(['default', 'secondary', 'destructive', 'outline'] as const).map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
}
