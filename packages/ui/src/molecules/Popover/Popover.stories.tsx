import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'

const meta: Meta<typeof Popover> = {
  title: 'molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-medium">Popover Title</p>
        <p className="text-sm text-muted-foreground mt-1">This is the popover content.</p>
      </PopoverContent>
    </Popover>
  ),
}

export const TableFilter: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Filter Column
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm font-semibold mb-3">Filter: Category</p>
        <div className="flex flex-col gap-2">
          {['In Stock', 'Low Stock', 'Out of Stock', 'Pre-order'].map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <Checkbox id={`pop-opt-${opt}`} />
              <label htmlFor={`pop-opt-${opt}`} className="text-sm cursor-pointer">
                {opt}
              </label>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="brand" className="flex-1">
            Apply
          </Button>
          <Button size="sm" variant="ghost" className="flex-1">
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Above: Story = {
  render: () => (
    <div className="mt-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Above</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm font-medium">Popover Above</p>
          <p className="text-sm text-muted-foreground mt-1">This popover opens above the trigger.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Align End</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm font-medium">Right-Aligned</p>
          <p className="text-sm text-muted-foreground mt-1">This popover aligns to the right edge.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const QuickActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Quick Actions
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col gap-1">
        {['Edit Product', 'Duplicate', 'Move', 'Archive', 'Delete'].map((action) => (
          <button key={action} className="text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors">
            {action}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  ),
}
