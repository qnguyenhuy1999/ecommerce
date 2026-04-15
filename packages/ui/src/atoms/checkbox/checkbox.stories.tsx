import type { Meta } from '@storybook/react'

import { Label } from '../../atoms/label/index'
import { Checkbox } from './index'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta

export const Unchecked = {
  args: {
    id: 'unchecked',
  },
}

export const Checked = {
  args: {
    id: 'checked',
    checked: true,
  },
}

export const Disabled = {
  args: {
    id: 'disabled',
    disabled: true,
  },
}

export const DisabledChecked = {
  args: {
    id: 'disabled-checked',
    checked: true,
    disabled: true,
  },
}

export const WithLabel = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="with-label" />
      <Label htmlFor="with-label" className="text-sm font-normal cursor-pointer">
        I agree to the terms and conditions
      </Label>
    </div>
  ),
}

export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {[
        { id: 'state-unchecked', label: 'Unchecked' },
        { id: 'state-checked', label: 'Checked', checked: true },
        { id: 'state-disabled', label: 'Disabled', disabled: true },
        {
          id: 'state-disabled-checked',
          label: 'Disabled & Checked',
          checked: true,
          disabled: true,
        },
      ].map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox id={item.id} checked={item.checked} disabled={item.disabled} />
          <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  ),
}
