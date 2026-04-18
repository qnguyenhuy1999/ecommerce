import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSpinner } from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'atoms/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof LoadingSpinner>

export const Default: Story = {
  args: {},
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-[var(--radius-lg)]">
      <p className="text-sm text-muted-foreground">Loading products catalog...</p>
      <LoadingSpinner size="lg" />
    </div>
  ),
}

export const InlineWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-muted-foreground">Processing payment</span>
    </div>
  ),
}
