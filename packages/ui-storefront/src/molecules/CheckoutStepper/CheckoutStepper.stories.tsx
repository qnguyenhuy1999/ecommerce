import type { Meta, StoryObj } from '@storybook/react'

import { CheckoutStepper } from './CheckoutStepper'

const meta: Meta<typeof CheckoutStepper> = {
  title: 'molecules/CheckoutStepper',
  component: CheckoutStepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CheckoutStepper>

const CHECKOUT_STEPS = [
  { id: 'cart', label: 'Cart' },
  { id: 'info', label: 'Information' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

const THREE_STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
]

export const Default: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    currentStepId: 'cart',
  },
}

export const Step2Info: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    currentStepId: 'info',
  },
}

export const Step3Payment: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    currentStepId: 'payment',
  },
}

export const Step4Review: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    currentStepId: 'review',
  },
}

export const ThreeSteps: Story = {
  args: {
    steps: THREE_STEPS,
    currentStepId: 'shipping',
  },
}

export const ThreeStepLast: Story = {
  args: {
    steps: THREE_STEPS,
    currentStepId: 'payment',
  },
}

export const FirstStepOnly: Story = {
  args: {
    steps: THREE_STEPS,
    currentStepId: 'address',
  },
}
