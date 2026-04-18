import type { Meta, StoryObj } from '@storybook/react'
import { Pencil, Trash2, Star, Search, Plus, X } from 'lucide-react'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  args: {
    icon: <Search />,
    label: 'Search',
  },
}

export const Ghost: Story = {
  args: {
    icon: <X />,
    label: 'Close',
    variant: 'ghost',
  },
}

export const Outline: Story = {
  args: {
    icon: <Pencil />,
    label: 'Edit',
    variant: 'outline',
  },
}

export const Brand: Story = {
  args: {
    icon: <Star />,
    label: 'Favorite',
    variant: 'brand',
  },
}

export const Destructive: Story = {
  args: {
    icon: <Trash2 />,
    label: 'Delete item',
    variant: 'destructive',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon={<Plus />} label="Small" size="sm" />
      <IconButton icon={<Plus />} label="Default" size="default" />
      <IconButton icon={<Plus />} label="Large" size="lg" />
    </div>
  ),
}

export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 p-3 border rounded-[var(--radius-md)]">
      <IconButton icon={<Pencil />} label="Edit" variant="outline" />
      <IconButton icon={<Trash2 />} label="Delete" variant="outline" />
      <IconButton icon={<Star />} label="Favorite" variant="outline" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    icon: <Trash2 />,
    label: 'Delete',
    disabled: true,
  },
}
