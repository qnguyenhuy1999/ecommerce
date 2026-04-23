import type { Meta, StoryObj } from '@storybook/react'

import { PaymentForm } from './PaymentForm'

const meta: Meta<typeof PaymentForm> = {
  title: 'Molecules/PaymentForm',
  component: PaymentForm,
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

type Story = StoryObj<typeof PaymentForm>

export const Default: Story = {
  args: {
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
}

export const Loading: Story = {
  args: {
    onSubmit: () => {},
    loading: true,
  },
}

export const WithError: Story = {
  args: {
    onSubmit: () => {},
    error: 'Your card was declined. Please check your details and try again.',
  },
}
