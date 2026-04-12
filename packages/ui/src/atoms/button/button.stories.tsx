import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button, buttonVariants } from './index'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
}

export const Destructive = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Outline = {
  args: {
    children: 'Cancel',
    variant: 'outline',
  },
}

export const Secondary = {
  args: {
    children: 'Save Draft',
    variant: 'secondary',
  },
}

export const Ghost = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
  },
}

export const Link = {
  args: {
    children: 'Learn more',
    variant: 'link',
  },
}

export const Small = {
  args: {
    children: 'Small',
    variant: 'default',
    size: 'sm',
  },
}

export const Large = {
  args: {
    children: 'Large Button',
    variant: 'default',
    size: 'lg',
  },
}

export const Icon = {
  args: {
    children: '+',
    variant: 'default',
    size: 'icon',
  },
}

export const Disabled = {
  args: {
    children: 'Cannot click',
    variant: 'default',
    disabled: true,
  },
}

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-8">
      {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
}
