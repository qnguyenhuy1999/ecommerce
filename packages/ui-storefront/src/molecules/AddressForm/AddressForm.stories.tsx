import type { Meta, StoryObj } from '@storybook/react'

import { AddressForm } from './AddressForm'

const meta: Meta<typeof AddressForm> = {
  title: 'Molecules/AddressForm',
  component: AddressForm,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-lg mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof AddressForm>

export const Empty: Story = {
  args: {
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
    onCancel: () => alert('cancelled'),
  },
}

export const Prefilled: Story = {
  args: {
    defaultValues: {
      fullName: 'Jane Doe',
      phone: '+65 9123 4567',
      addressLine1: '123 Orchard Road',
      addressLine2: '#04-01 ION Orchard',
      city: 'Singapore',
      postalCode: '238858',
      country: 'SG',
    },
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
  },
}

export const WithErrors: Story = {
  args: {
    onSubmit: (data) => alert(JSON.stringify(data, null, 2)),
    errors: {
      fullName: 'Full name is required',
      phone: 'Invalid phone number',
      postalCode: 'Postal code must be 6 digits',
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    onSubmit: () => {},
  },
}
