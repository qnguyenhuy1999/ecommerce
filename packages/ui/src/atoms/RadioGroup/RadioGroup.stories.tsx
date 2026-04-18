import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <RadioGroupItem value="standard" label="Standard Shipping — Free" />
      <RadioGroupItem value="express" label="Express Shipping — $12.99" />
      <RadioGroupItem value="overnight" label="Overnight Delivery — $29.99" />
    </RadioGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <RadioGroupItem value="card" label="Credit / Debit Card" />
      <RadioGroupItem value="paypal" label="PayPal" />
      <RadioGroupItem value="apple" label="Apple Pay" />
      <RadioGroupItem value="bank" label="Bank Transfer" />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup orientation="horizontal" defaultValue="monthly">
      <RadioGroupItem value="monthly" label="Monthly" />
      <RadioGroupItem value="quarterly" label="Quarterly" />
      <RadioGroupItem value="annual" label="Annual" />
    </RadioGroup>
  ),
}

export const WithDefaultValue: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState('standard')
    return (
      <div className="flex flex-col gap-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioGroupItem value="standard" label="Standard (3–5 business days)" />
          <RadioGroupItem value="express" label="Express (1–2 business days)" />
          <RadioGroupItem value="overnight" label="Overnight" />
        </RadioGroup>
        <p className="text-xs text-muted-foreground">Selected: {value}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" orientation="horizontal">
      <RadioGroupItem value="free" label="Free Plan" />
      <RadioGroupItem value="pro" label="Pro — $9.99/mo" />
      <RadioGroupItem value="enterprise" label="Enterprise" disabled />
    </RadioGroup>
  ),
}
