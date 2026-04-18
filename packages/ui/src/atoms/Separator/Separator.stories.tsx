import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '../../components/ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'atoms/Separator',
  component: Separator,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Section One</h3>
        <p className="text-sm text-muted-foreground">Content for the first section.</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Section Two</h3>
        <p className="text-sm text-muted-foreground">Content for the second section.</p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Dashboard</span>
        <span className="text-xs text-muted-foreground">Overview</span>
      </div>
      <Separator orientation="vertical" className="h-8" />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Analytics</span>
        <span className="text-xs text-muted-foreground">Reports</span>
      </div>
      <Separator orientation="vertical" className="h-8" />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Settings</span>
        <span className="text-xs text-muted-foreground">Preferences</span>
      </div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-80 border rounded-[var(--radius-lg)] p-5">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">sarah@example.com</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-sm">Pro</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Member since</span>
          <span className="text-sm font-medium">March 2024</span>
        </div>
      </div>
    </div>
  ),
}
