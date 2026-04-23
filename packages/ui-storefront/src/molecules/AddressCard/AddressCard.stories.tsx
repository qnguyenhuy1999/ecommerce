import type { Meta, StoryObj } from '@storybook/react'

import { AddressCard } from './AddressCard'

const ADDRESS = {
  fullName: 'Jane Doe',
  phone: '+65 9123 4567',
  addressLine1: '123 Orchard Road',
  addressLine2: '#04-01 ION Orchard',
  city: 'Singapore',
  postalCode: '238858',
  country: 'SG',
}

const meta: Meta<typeof AddressCard> = {
  title: 'Molecules/AddressCard',
  component: AddressCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-sm mx-auto">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof AddressCard>

export const Default: Story = {
  args: {
    address: ADDRESS,
    onEdit: () => alert('edit'),
    onDelete: () => alert('delete'),
    onSetDefault: () => alert('set default'),
  },
}

export const IsDefault: Story = {
  args: {
    address: ADDRESS,
    isDefault: true,
    onEdit: () => alert('edit'),
    onDelete: () => alert('delete'),
  },
}

export const Minimal: Story = {
  args: {
    address: { ...ADDRESS, addressLine2: undefined },
    isDefault: false,
  },
}
