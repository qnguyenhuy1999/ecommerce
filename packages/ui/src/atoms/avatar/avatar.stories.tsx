import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './index'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback = {
  args: {
    children: 'JD',
  },
}

export const Small = {
  render: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback className="text-xs">SC</AvatarFallback>
    </Avatar>
  ),
}

export const Large = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback className="text-xl">SC</AvatarFallback>
    </Avatar>
  ),
}

export const FallbackOnly = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
    </div>
  ),
}
