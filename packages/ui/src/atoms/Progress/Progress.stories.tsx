import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'atoms/Progress',
  component: Progress,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    value: 65,
  },
}

export const WithLabel: Story = {
  args: {
    value: 65,
    showLabel: true,
  },
}

export const Complete: Story = {
  args: {
    value: 100,
    showLabel: true,
  },
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <Progress value={45} size="sm" />
      <Progress value={45} size="default" />
      <Progress value={45} size="lg" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Default</p>
        <Progress value={72} variant="default" showLabel />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Brand</p>
        <Progress value={55} variant="brand" showLabel />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Success</p>
        <Progress value={100} variant="success" showLabel />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Warning</p>
        <Progress value={28} variant="warning" showLabel />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Info</p>
        <Progress value={88} variant="info" showLabel />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Destructive</p>
        <Progress value={10} variant="destructive" showLabel />
      </div>
    </div>
  ),
}

export const CheckoutProgress: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm p-5 border rounded-[var(--radius-lg)]">
      <h3 className="text-sm font-semibold">Checkout Progress</h3>
      <Progress value={75} variant="brand" showLabel />
      <p className="text-xs text-muted-foreground">3 of 4 steps complete</p>
    </div>
  ),
}

export const FileUpload: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm p-5 border rounded-[var(--radius-lg)]">
      <div className="flex justify-between text-sm">
        <span className="font-medium">uploading_image.jpg</span>
        <span className="text-muted-foreground">68%</span>
      </div>
      <Progress value={68} variant="brand" size="sm" />
    </div>
  ),
}
