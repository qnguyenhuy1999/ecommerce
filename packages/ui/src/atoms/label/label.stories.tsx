import type { Meta } from '@storybook/react'

import { Label } from './index'
import { Input } from '../../atoms/input/index'

const meta = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof Label>

export default meta

export const Default = {
  args: {
    children: 'Email address',
    htmlFor: 'email',
  },
}

export const Required = {
  render: () => (
    <div className="space-y-1.5">
      <Label htmlFor="required-field" className="text-sm font-medium">
        Full Name <span className="text-destructive">*</span>
      </Label>
      <Input id="required-field" placeholder="John Doe" />
    </div>
  ),
}

export const WithInput = {
  render: () => (
    <div className="space-y-1.5">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="johndoe" />
    </div>
  ),
}

export const Disabled = {
  render: () => (
    <div className="space-y-1.5">
      <Label
        htmlFor="disabled-input"
        className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Disabled Field
      </Label>
      <Input id="disabled-input" placeholder="Cannot edit" disabled />
    </div>
  ),
}
