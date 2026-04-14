import type { Meta } from '@storybook/react'

import { Separator } from './index'

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>

export default meta

export const Horizontal = {
  render: () => (
    <div className="w-64 space-y-2">
      <p className="text-sm">Above content</p>
      <Separator className="w-full" />
      <p className="text-sm">Below content</p>
    </div>
  ),
}

export const Vertical = {
  render: () => (
    <div className="flex h-24 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" className="h-full" />
      <span className="text-sm">Right</span>
    </div>
  ),
}

export const ListWithSeparator = {
  render: () => (
    <div className="w-64 space-y-2">
      {['Dashboard', 'Analytics', 'Reports', 'Settings'].map((item) => (
        <div key={item}>
          <p className="py-2 text-sm">{item}</p>
          <Separator className="w-full" />
        </div>
      ))}
    </div>
  ),
}
