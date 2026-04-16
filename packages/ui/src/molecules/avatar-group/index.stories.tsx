import type { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './index'

const meta: Meta<typeof AvatarGroup> = {
  title: 'molecules/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {
  render: () => (
    <AvatarGroup
      items={[
        { name: 'Sarah Chen', src: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Alex Kim', src: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Jordan Lee', src: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Morgan Davis', src: 'https://i.pravatar.cc/150?img=4' },
        { name: 'Taylor Wong', src: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Casey Brown', src: 'https://i.pravatar.cc/150?img=6' },
      ]}
    />
  ),
}

export const Small: Story = {
  render: () => (
    <AvatarGroup
      size="sm"
      items={[
        { name: 'Priya Sharma', src: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Marcus Johnson', src: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Lin Wei', src: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Fatima Al-Hassan', src: 'https://i.pravatar.cc/150?img=10' },
        { name: 'Tom Nakamura', src: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Sofia Reyes', src: 'https://i.pravatar.cc/150?img=12' },
      ]}
    />
  ),
}

export const Large: Story = {
  render: () => (
    <AvatarGroup
      size="lg"
      items={[
        { name: 'Nadia Petrov', src: 'https://i.pravatar.cc/150?img=13' },
        { name: 'Kofi Asante', src: 'https://i.pravatar.cc/150?img=14' },
        { name: 'Emma Larsson', src: 'https://i.pravatar.cc/150?img=15' },
        { name: 'Ravi Patel', src: 'https://i.pravatar.cc/150?img=16' },
        { name: 'Isabella Costa', src: 'https://i.pravatar.cc/150?img=17' },
      ]}
    />
  ),
}

export const Overflow: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs text-muted-foreground mb-2">6 items, max=5 (shows +1)</p>
        <AvatarGroup
          items={[
            { name: 'Sarah Chen', src: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Alex Kim', src: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Jordan Lee', src: 'https://i.pravatar.cc/150?img=3' },
            { name: 'Morgan Davis', src: 'https://i.pravatar.cc/150?img=4' },
            { name: 'Taylor Wong', src: 'https://i.pravatar.cc/150?img=5' },
            { name: 'Casey Brown', src: 'https://i.pravatar.cc/150?img=6' },
          ]}
          max={5}
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">3 items, max=3 (no overflow)</p>
        <AvatarGroup
          items={[
            { name: 'Sarah Chen', src: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Alex Kim', src: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Jordan Lee', src: 'https://i.pravatar.cc/150?img=3' },
          ]}
          max={3}
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">8 items, max=4 (shows +4)</p>
        <AvatarGroup
          size="sm"
          items={[
            { name: 'Sarah Chen' },
            { name: 'Alex Kim' },
            { name: 'Jordan Lee' },
            { name: 'Morgan Davis' },
            { name: 'Taylor Wong' },
            { name: 'Casey Brown' },
            { name: 'Dana White' },
            { name: 'Evan Blake' },
          ]}
          max={4}
        />
      </div>
    </div>
  ),
}

export const NoTooltips: Story = {
  render: () => (
    <AvatarGroup
      showTooltips={false}
      items={[
        { name: 'Priya Sharma', src: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Marcus Johnson', src: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Lin Wei', src: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Fatima Al-Hassan', src: 'https://i.pravatar.cc/150?img=10' },
        { name: 'Tom Nakamura', src: 'https://i.pravatar.cc/150?img=11' },
      ]}
    />
  ),
}

export const TeamMembers: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Project Team</span>
        <AvatarGroup
          size="sm"
          items={[
            { name: 'Sarah Chen', src: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Alex Kim', src: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Jordan Lee', src: 'https://i.pravatar.cc/150?img=3' },
            { name: 'Morgan Davis', src: 'https://i.pravatar.cc/150?img=4' },
            { name: 'Taylor Wong', src: 'https://i.pravatar.cc/150?img=5' },
          ]}
          max={5}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Reviewers</span>
        <AvatarGroup
          size="sm"
          items={[
            { name: 'Priya Sharma', src: 'https://i.pravatar.cc/150?img=7' },
            { name: 'Marcus Johnson', src: 'https://i.pravatar.cc/150?img=8' },
            { name: 'Lin Wei', src: 'https://i.pravatar.cc/150?img=9' },
          ]}
          max={3}
        />
      </div>
    </div>
  ),
}
