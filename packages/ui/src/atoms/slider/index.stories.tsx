import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './index'

const meta: Meta<typeof Slider> = {
  title: 'atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {
    defaultValue: 50,
  },
}

export const Range: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      <p className="text-xs text-muted-foreground">Range sliders not supported — Slider uses a single value.</p>
      <Slider min={0} max={100} defaultValue={20} />
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    min: 0,
    max: 500,
    defaultValue: 150,
    formatLabel: (v: number) => `$${String(v)}`,
  },
}

export const PriceRange: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      <h3 className="text-sm font-semibold">Price Range</h3>
      <Slider min={0} max={500} defaultValue={49} step={1} formatLabel={(v: number) => `$${String(v)}`} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$0</span>
        <span>$500</span>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    defaultValue: 35,
    disabled: true,
  },
}

export const FineGrained: Story = {
  args: {
    min: 0,
    max: 100,
    step: 0.1,
    defaultValue: 67.5,
    formatLabel: (v: number) => `${v.toFixed(1)}%`,
  },
}

export const VolumeSlider: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Volume</span>
        <span className="text-sm text-muted-foreground">75%</span>
      </div>
      <Slider min={0} max={100} defaultValue={75} />
    </div>
  ),
}
