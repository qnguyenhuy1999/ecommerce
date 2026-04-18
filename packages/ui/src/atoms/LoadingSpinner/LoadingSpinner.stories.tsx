import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSpinner } from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'atoms/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}
export default meta
type Story = StoryObj<typeof LoadingSpinner>

export const SizeShowcase: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingSpinner size="xs" />
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="default" />
      <LoadingSpinner size="lg" />
      <LoadingSpinner size="xl" />
    </div>
  ),
}

export const VariantShowcase: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingSpinner variant="brand" size="lg" />
      <LoadingSpinner variant="neutral" size="lg" />
    </div>
  ),
}

export const OnDarkSurface: Story = {
  render: () => (
    <div className="flex items-center gap-6 bg-[var(--gray-900)] rounded-xl p-6">
      <LoadingSpinner variant="white" size="lg" />
      <LoadingSpinner variant="neutral" size="lg" />
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 p-8 border rounded-[var(--radius-lg)]">
      <p className="text-sm text-[var(--text-secondary)] font-medium">Loading products catalog...</p>
      <LoadingSpinner size="lg" variant="brand" />
    </div>
  ),
}

export const InlineWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-[var(--text-secondary)]">Processing payment</span>
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-6">
      {(['xs', 'sm', 'default', 'lg', 'xl'] as const).map((size) =>
        (['brand', 'neutral'] as const).map((variant) => (
          <div key={`${size}-${variant}`} className="flex flex-col items-center gap-2">
            <LoadingSpinner size={size} variant={variant} />
            <span className="text-xs text-muted-foreground font-mono">
              {size}/{variant}
            </span>
          </div>
        )),
      )}
    </div>
  ),
}
