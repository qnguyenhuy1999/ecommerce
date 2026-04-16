import type { Meta, StoryObj } from '@storybook/react'

import { Avatar, AvatarFallback, AvatarImage } from './index'

const meta: Meta<typeof Avatar> = {
  title: 'atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="Jane Cooper" />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://i.pravatar.cc/150?img=11" alt="Alex" />
        <AvatarFallback className="text-[10px]">AL</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Sam" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="Jane" />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarImage src="https://i.pravatar.cc/150?img=47" alt="Riley" />
        <AvatarFallback className="text-base">RL</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://i.pravatar.cc/150?img=52" alt="Taylor" />
        <AvatarFallback className="text-xl">TL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackOnly: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      {['Alice Chen', 'Bob Martinez', 'Carol Kim', 'David Okonkwo', 'Eva Rossi'].map((name) => {
        const initials = name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
        const colors = [
          'bg-blue-100 text-blue-700',
          'bg-green-100 text-green-700',
          'bg-amber-100 text-amber-700',
          'bg-purple-100 text-purple-700',
          'bg-rose-100 text-rose-700',
        ]
        const colorIndex = name.charCodeAt(0) % colors.length
        return (
          <Avatar key={name}>
            <AvatarFallback className={`${colors[colorIndex]} font-semibold`}>{initials}</AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  ),
}

export const ImageLoading: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="Loading avatar" />
        <AvatarFallback className="bg-muted">LD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://invalid-url-example-xyz123.com/broken.png" alt="Broken avatar" />
        <AvatarFallback className="bg-muted">BR</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithRing: Story = {
  render: () => (
    <div className="flex gap-6 items-center">
      <Avatar className="ring-2 ring-brand ring-offset-2">
        <AvatarImage src="https://i.pravatar.cc/150?img=56" alt="Project lead" />
        <AvatarFallback className="bg-muted font-semibold">PL</AvatarFallback>
      </Avatar>
      <Avatar className="ring-2 ring-destructive ring-offset-2">
        <AvatarImage src="https://i.pravatar.cc/150?img=60" alt="Admin" />
        <AvatarFallback className="bg-muted font-semibold text-destructive">AD</AvatarFallback>
      </Avatar>
      <Avatar className="ring-2 ring-success ring-offset-2">
        <AvatarImage src="https://i.pravatar.cc/150?img=59" alt="Verified user" />
        <AvatarFallback className="bg-muted font-semibold text-success">VU</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const GroupGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
      {[
        { name: 'Priya Sharma', img: 5 },
        { name: 'Marcus Johnson', img: 8 },
        { name: 'Lin Wei', img: 10 },
        { name: 'Fatima Al-Hassan', img: 15 },
        { name: 'Tom Nakamura', img: 22 },
        { name: 'Sofia Reyes', img: 25 },
        { name: 'Kofi Asante', img: 29 },
        { name: 'Nadia Petrov', img: 33 },
      ].map(({ name, img }) => (
        <Avatar key={name} className="h-12 w-12">
          <AvatarImage src={`https://i.pravatar.cc/150?img=${String(img)}`} alt={name} />
          <AvatarFallback className="font-semibold text-sm">
            {name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}
