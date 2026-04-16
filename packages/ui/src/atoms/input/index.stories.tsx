import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Search, Eye, DollarSign } from 'lucide-react'
import { Input } from './index'

const meta: Meta<typeof Input> = {
  title: 'atoms/Input',
  component: Input,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter product name...',
  },
}

export const WithPrefixIcon: Story = {
  args: {
    prefixIcon: <Search className="w-4 h-4" />,
    placeholder: 'Search products...',
  },
}

export const WithSuffixIcon: Story = {
  args: {
    suffixIcon: <Eye className="w-4 h-4" />,
    type: 'password',
    placeholder: 'Password',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Enter email address',
    error: true,
    defaultValue: 'invalid-email',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'This field is disabled',
    disabled: true,
    defaultValue: 'Locked value',
  },
}

export const WithFloatingLabel: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
  },
}

export const WithCharacterCount: Story = {
  args: {
    placeholder: 'Product description',
    showCount: true,
    maxLength: 150,
    defaultValue: 'Premium wireless headphones with active noise cancellation...',
  },
  render: (args) => (
    <Input
      {...args}
      value={String(args.defaultValue ?? '')}
      onChange={() => {}}
    />
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <Input size="sm" placeholder="Small size" />
      <Input size="default" placeholder="Default size" />
      <Input size="lg" placeholder="Large size" />
    </div>
  ),
}

export const Loading: Story = {
  args: {
    prefixIcon: <Search className="w-4 h-4" />,
    loading: true,
    placeholder: 'Searching catalog...',
  },
}

export const PriceInput: Story = {
  args: {
    prefixIcon: <DollarSign className="w-4 h-4" />,
    placeholder: '0.00',
    type: 'number',
    defaultValue: '29.99',
  },
  render: (args) => (
    <Input
      {...args}
      value={String(args.defaultValue ?? '')}
      onChange={() => {}}
    />
  ),
}

export const FullFeatured: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState('')
    return (
      <div className="flex flex-col gap-3 max-w-sm">
        <Input
          label="Product Title"
          placeholder=" "
          value={value}
          onChange={(e) => { setValue(e.target.value) }}
          showCount
          maxLength={80}
        />
        <Input prefixIcon={<Search className="w-4 h-4" />} placeholder="Search by SKU or name..." />
        <Input error prefixIcon={<Search className="w-4 h-4" />} placeholder="Search..." defaultValue="unknown-sku" />
      </div>
    )
  },
}
