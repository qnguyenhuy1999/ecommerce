import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Label } from '../../atoms/label/index'
import { Textarea } from './index'

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => <Textarea className="w-80" placeholder="Type your message here..." />,
}

export const WithLabel = {
  render: () => (
    <div className="space-y-1.5 w-80">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Enter a detailed description..." rows={4} />
    </div>
  ),
}

export const Disabled = {
  render: () => (
    <Textarea
      className="w-80"
      placeholder="This field is disabled"
      disabled
      defaultValue="You cannot edit this content."
    />
  ),
}

export const LongContent = {
  render: () => (
    <Textarea
      className="w-80"
      rows={6}
      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    />
  ),
}
