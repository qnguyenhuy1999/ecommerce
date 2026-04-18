import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '../Input/Input'
import { Checkbox } from '../Checkbox/Checkbox'
import { Label } from '../../components/ui/label'

const meta: Meta<typeof Label> = {
  title: 'atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    children: 'Label text',
  },
}

export const BasicLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label>Default label</Label>
      <Label className="text-muted-foreground">Muted label</Label>
      <Label className="text-destructive">Error label</Label>
    </div>
  ),
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" defaultValue="Sarah Chen" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="sarah@example.com" defaultValue="sarah@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          className="flex min-h-[var(--space-16)] w-full rounded-[var(--radius-sm)] border border-input bg-transparent px-3 py-2 text-sm"
          placeholder="Tell us about yourself"
          defaultValue="Product designer with 8 years of experience building design systems and consumer apps."
        />
      </div>
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="font-normal">
          I agree to the{' '}
          <a href="#" className="text-brand hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-brand hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="font-normal">
          Send me product updates and promotional emails
        </Label>
      </div>
    </div>
  ),
}

export const RequiredField: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 max-w-sm">
      <Label htmlFor="email-req">
        Email Address <span className="text-destructive">*</span>
      </Label>
      <Input id="email-req" type="email" placeholder="you@example.com" />
      <p className="text-xs text-muted-foreground">This field is required</p>
    </div>
  ),
}
