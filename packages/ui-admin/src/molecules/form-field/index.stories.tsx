import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '@ecom/ui'

import { FormField } from './index'

const meta: Meta<typeof FormField> = {
  title: 'ui-admin/molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField label="Full Name" htmlFor="name">
        <Input id="name" placeholder="Jane Doe" />
      </FormField>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField
        label="Email Address"
        description="We'll send a verification link to this address."
        htmlFor="email"
      >
        <Input id="email" type="email" placeholder="jane@example.com" />
      </FormField>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField label="Product Name" required htmlFor="product">
        <Input id="product" placeholder="e.g. Wireless Headphones Pro" />
      </FormField>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField
        label="Password"
        error="Password must be at least 8 characters."
        htmlFor="password"
      >
        <Input id="password" type="password" defaultValue="123" />
      </FormField>
    </div>
  ),
}

export const WithSuccess: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField
        label="Username"
        success
        description="This username is available."
        htmlFor="username"
      >
        <Input id="username" defaultValue="jane_doe" />
      </FormField>
    </div>
  ),
}

export const WithCharacterCount: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <FormField
        label="Product Description"
        characterCount={{ current: 42, max: 200 }}
        htmlFor="desc"
      >
        <Input id="desc" placeholder="Describe your product..." />
      </FormField>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-md space-y-8">
      <FormField label="Default Field" htmlFor="f1">
        <Input id="f1" placeholder="Placeholder text" />
      </FormField>
      <FormField label="Required Field" required htmlFor="f2">
        <Input id="f2" placeholder="This field is required" />
      </FormField>
      <FormField label="With Helper Text" description="Help users fill this in correctly." htmlFor="f3">
        <Input id="f3" placeholder="Helper text shown below" />
      </FormField>
      <FormField label="Error State" error="This is not a valid entry." htmlFor="f4">
        <Input id="f4" defaultValue="bad input" />
      </FormField>
      <FormField label="Success State" success htmlFor="f5">
        <Input id="f5" defaultValue="Validated value" />
      </FormField>
      <FormField label="Character Counter" characterCount={{ current: 85, max: 200 }} htmlFor="f6">
        <Input id="f6" placeholder="Type up to 200 characters..." />
      </FormField>
    </div>
  ),
}
