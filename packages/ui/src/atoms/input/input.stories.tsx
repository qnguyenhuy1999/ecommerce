import type { Meta } from '@storybook/react'

import { Input } from './index'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta

export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <label className="text-sm font-medium">Email address</label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled = {
  args: {
    placeholder: 'Cannot edit',
    disabled: true,
  },
}

export const WithError = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <label className="text-sm font-medium">Password</label>
      <Input type="password" placeholder="Enter password" className="border-destructive" />
      <p className="text-xs text-destructive">Password must be at least 8 characters.</p>
    </div>
  ),
}
