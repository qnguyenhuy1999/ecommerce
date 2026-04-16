import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Checkbox } from './index'

const meta: Meta<typeof Checkbox> = {
  title: 'atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox />
      <label className="text-sm font-medium">I agree to the terms and conditions</label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox defaultChecked />
      <label className="text-sm font-medium">Subscribe to newsletter</label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox disabled />
        <label className="text-sm font-medium text-muted-foreground">Disabled (unchecked)</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox disabled defaultChecked />
        <label className="text-sm font-medium text-muted-foreground">Disabled (checked)</label>
      </div>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Checkbox error />
        <label className="text-sm font-medium">Required field must be checked</label>
      </div>
      <p className="text-xs text-destructive">Please accept the terms to continue</p>
    </div>
  ),
}

export const CheckboxGroup: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = React.useState(['shipping'])
    const options = [
      { id: 'shipping', label: 'Standard Shipping — Free' },
      { id: 'express', label: 'Express Shipping — $12.99' },
      { id: 'overnight', label: 'Overnight Shipping — $24.99' },
    ]
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Select shipping method:</p>
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-3">
            <Checkbox
              checked={checked.includes(opt.id)}
              onCheckedChange={(c) => {
                if (c) setChecked((prev) => [...prev, opt.id])
                else setChecked((prev) => prev.filter((x) => x !== opt.id))
              }}
            />
            <label className="text-sm">{opt.label}</label>
          </div>
        ))}
      </div>
    )
  },
}

export const FilterList: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = React.useState(['electronics', 'clothing'])
    const filters = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys']
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold mb-1">Product Categories</p>
        {filters.map((filter) => {
          const id = filter.toLowerCase().replace(/\s+/g, '-')
          return (
            <div key={filter} className="flex items-center gap-3">
              <Checkbox
                checked={selected.includes(id)}
                onCheckedChange={(c) => {
                  if (c) setSelected((prev) => [...prev, id])
                  else setSelected((prev) => prev.filter((x) => x !== id))
                }}
              />
              <label className="text-sm">{filter}</label>
            </div>
          )
        })}
      </div>
    )
  },
}
