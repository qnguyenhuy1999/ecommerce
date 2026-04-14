import type { Meta } from '@storybook/react'

import { Select } from './index'

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>

export default meta

export const Default = {
  render: () => (
    <Select className="w-64">
      <option value="">Select an option</option>
      <option value="option-1">Option 1</option>
      <option value="option-2">Option 2</option>
      <option value="option-3">Option 3</option>
    </Select>
  ),
}

export const WithOptions = {
  render: () => (
    <Select className="w-64" defaultValue="medium">
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </Select>
  ),
}

export const Disabled = {
  render: () => (
    <Select className="w-64" disabled>
      <option value="">Cannot change</option>
      <option value="option-1">Option 1</option>
    </Select>
  ),
}

export const AllOptions = {
  render: () => (
    <Select className="w-64" defaultValue="react">
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="angular">Angular</option>
      <option value="svelte">Svelte</option>
      <option value="solid">SolidJS</option>
    </Select>
  ),
}
