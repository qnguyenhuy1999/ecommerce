import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { VariantSelector } from './VariantSelector'

const meta: Meta<typeof VariantSelector> = {
  title: 'molecules/VariantSelector',
  component: VariantSelector,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VariantSelector>

function PillSelector(props: React.ComponentProps<typeof VariantSelector>) {
  const [val, setVal] = useState<string>('')
  return <VariantSelector {...props} type="pill" value={val} onChange={setVal} />
}

function ColorSelector(props: React.ComponentProps<typeof VariantSelector>) {
  const [val, setVal] = useState<string>('')
  return <VariantSelector {...props} type="color" value={val} onChange={setVal} />
}

export const PillDefault: Story = {
  render: () => (
    <div className="max-w-sm">
      <PillSelector
        name="Size"
        options={[
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
          { label: 'XXL', value: 'xxl' },
        ]}
      />
    </div>
  ),
}

export const PillWithError: Story = {
  render: () => (
    <div className="max-w-sm">
      <PillSelector
        name="Size"
        options={[
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ]}
        error="Please select a size"
      />
    </div>
  ),
}

export const PillWithDisabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <PillSelector
        name="Size"
        options={[
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm', disabled: true },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ]}
      />
    </div>
  ),
}

export const ColorSwatches: Story = {
  render: () => (
    <ColorSelector
      name="Color"
      options={[
        { label: 'Black', value: 'black', color: 'var(--intent-info)' },
        { label: 'White', value: 'white', color: 'var(--intent-success)' },
        { label: 'Navy', value: 'navy', color: 'var(--intent-info)' },
        { label: 'Red', value: 'red', color: 'var(--intent-info)' },
        { label: 'Green', value: 'green', color: 'var(--intent-info)' },
        { label: 'Gray', value: 'gray', color: 'var(--intent-info)' },
      ]}
    />
  ),
}

export const ColorWithDisabled: Story = {
  render: () => (
    <ColorSelector
      name="Color"
      options={[
        { label: 'Black', value: 'black', color: 'var(--intent-info)' },
        { label: 'White', value: 'white', color: 'var(--intent-success)' },
        { label: 'Red', value: 'red', color: 'var(--intent-info)', disabled: true },
        { label: 'Green', value: 'green', color: 'var(--intent-info)' },
        { label: 'Yellow', value: 'yellow', color: 'var(--intent-warning)' },
      ]}
    />
  ),
}

export const ImageSwatches: Story = {
  render: () => (
    <VariantSelector
      type="image"
      name="Pattern"
      value=""
      onChange={() => {}}
      options={[
        { label: 'Solid', value: 'solid', image: 'https://picsum.photos/seed/swatch1/80/80' },
        { label: 'Striped', value: 'striped', image: 'https://picsum.photos/seed/swatch2/80/80' },
        { label: 'Plaid', value: 'plaid', image: 'https://picsum.photos/seed/swatch3/80/80' },
        { label: 'Floral', value: 'floral', image: 'https://picsum.photos/seed/swatch4/80/80', disabled: true },
      ]}
    />
  ),
}

export const FullSelector: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <PillSelector
        name="Size"
        options={[
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ]}
      />
      <ColorSelector
        name="Color"
        options={[
          { label: 'Black', value: 'black', color: 'var(--intent-info)' },
          { label: 'White', value: 'white', color: 'var(--intent-success)' },
          { label: 'Navy', value: 'navy', color: 'var(--intent-info)' },
          { label: 'Red', value: 'red', color: 'var(--intent-info)' },
        ]}
      />
    </div>
  ),
}
