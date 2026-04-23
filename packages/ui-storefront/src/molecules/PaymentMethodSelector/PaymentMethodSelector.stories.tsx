import type { Meta, StoryObj } from '@storybook/react'
import { CreditCard, Wallet, Building } from 'lucide-react'

import { PaymentMethodSelector } from './PaymentMethodSelector'

const METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, AMEX',
    icon: <CreditCard className="w-5 h-5" />,
  },
  { id: 'paypal', label: 'PayPal', description: 'Pay with your PayPal account', icon: <Wallet className="w-5 h-5" /> },
  {
    id: 'bank',
    label: 'Bank Transfer',
    description: 'Direct bank transfer (2-3 business days)',
    icon: <Building className="w-5 h-5" />,
    disabled: true,
  },
]

const meta: Meta<typeof PaymentMethodSelector> = {
  title: 'Molecules/PaymentMethodSelector',
  component: PaymentMethodSelector,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof PaymentMethodSelector>

export const Default: Story = {
  args: {
    methods: METHODS,
    selected: 'card',
    onChange: (id) => alert(`Selected: ${id}`),
  },
}

export const PayPalSelected: Story = {
  args: {
    methods: METHODS,
    selected: 'paypal',
    onChange: (id) => alert(`Selected: ${id}`),
  },
}
