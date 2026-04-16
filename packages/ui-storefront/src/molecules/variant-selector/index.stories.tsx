import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { VariantSelector } from './index'

const meta: Meta<typeof VariantSelector> = {
  title: 'ui-storefront/molecules/VariantSelector',
  component: VariantSelector,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VariantSelector>

function PillSelector(props: React.ComponentProps<typeof VariantSelector>) {
  const [val, setVal] = useState<string>('')
  return (
    <VariantSelector
      {...props}
      type="pill"
      value={val}
      onChange={setVal}
    />
  )
}

function ColorSelector(props: React.ComponentProps<typeof VariantSelector>) {
  const [val, setVal] = useState<string>('')
  return (
    <VariantSelector
      {...props}
      type="color"
      value={val}
      onChange={setVal}
    />
  )
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
        { label: 'Black', value: 'black', color: '#1a1a1a' },
        { label: 'White', value: 'white', color: '#ffffff' },
        { label: 'Navy', value: 'navy', color: '#1e3a5f' },
        { label: 'Red', value: 'red', color: '#dc2626' },
        { label: 'Green', value: 'green', color: '#16a34a' },
        { label: 'Gray', value: 'gray', color: '#6b7280' },
      ]}
    />
  ),
}

export const ColorWithDisabled: Story = {
  render: () => (
    <ColorSelector
      name="Color"
      options={[
        { label: 'Black', value: 'black', color: '#1a1a1a' },
        { label: 'White', value: 'white', color: '#ffffff' },
        { label: 'Red', value: 'red', color: '#dc2626', disabled: true },
        { label: 'Green', value: 'green', color: '#16a34a' },
        { label: 'Yellow', value: 'yellow', color: '#eab308' },
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
          { label: 'Black', value: 'black', color: '#1a1a1a' },
          { label: 'White', value: 'white', color: '#ffffff' },
          { label: 'Navy', value: 'navy', color: '#1e3a5f' },
          { label: 'Red', value: 'red', color: '#dc2626' },
        ]}
      />
    </div>
  ),
}
